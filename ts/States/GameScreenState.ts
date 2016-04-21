/// <reference path="../../phaserLib/phaser.d.ts"/>
/// <reference path="../GameObjects/Bird.ts"/>
/// <reference path="../GameObjects/Enemy.ts"/>
/// <reference path="../Utils/UtilFunctions.ts"/>
/// <reference path="../Utils/Timer.ts"/>
/// <reference path="../Utils/IntervalTimer.ts"/>
/// <reference path="../Utils/CountdownTimer.ts"/>
/// <reference path="../Utils/RandomIntervalTimer.ts"/>
module States
{
    export class GameScreenState extends Phaser.State {

        game: Phaser.Game;

        // sprite groups
        bgGroup: Phaser.Group;
        midGroup: Phaser.Group;
        frontGroup: Phaser.Group;

        // birdstuff
        bird: Sprites.Bird;
        //birdOutline: Phaser.Sprite;
        //FLY_BUTTON: Phaser.Key;

        // collisions
        //collisionGroupBirdEnemy: Phaser.Physics.P2.CollisionGroup;

        // enemies
        //enemy: Phaser.Sprite;
        //enemies: { [id: string] : Phaser.Sprite; } = {};
        //enemyGroup: Phaser.Group;

        // playtime
        playTimeString: string = "00:00:00";
        playTimeText: Phaser.BitmapText;

        // score
        score: number;
        scoreMultiplicator:number;
        scoreText: Phaser.BitmapText;
        scoreWord: string = "SCORE";
        numScoreLetters: number;
        scoreIndicatorText: Phaser.BitmapText;
        scoreMultiplicatorText: Phaser.BitmapText;
        baseScore: number = 1;
        multiplicatorColors: Array<number> = [0xffffffff,0xff1eff00, 0x00bfff, 0xffa335ee, 0xffff8000];

        // user info
        userInfo: Phaser.BitmapText;

        // timing
        startTime: number;
        scoreLettersTimer: Utils.IntervalTimer;
        scoreTimer: Utils.IntervalTimer;
        maxScoreCountdown: Utils.CountdownTimer;
        gameTimeCountDown: Utils.CountdownTimer;
        enemySpawnTimer: Utils.RandomIntervalTimer;
        MAX_ENEMY_SPAWN_TIME:number = 8000;
        MIN_ENEMY_SPAWN_TIME:number = 1500;
        enemyHitTimeout: Utils.CountdownTimer;
        gameAdjustTimer: Utils.CountdownTimer;

        // bg
        bgTile0: Phaser.TileSprite;
        bgTile1: Phaser.TileSprite;
        bgTile2: Phaser.TileSprite;

        grayFilter: Phaser.Filter;

        // sound
        rndGen: Phaser.RandomDataGenerator;
        music: Phaser.Sound;
        effects: Array<Phaser.Sound>;


        create()
        {

            var seed: number = this.game.time.time;
            this.rndGen = new Phaser.RandomDataGenerator([seed]);

            //this.FLY_BUTTON = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
            //this.FLY_BUTTON.onDown.add(GameScreenState.prototype.flapWings, this);

            this.grayFilter = this.game.add.filter('Gray'); // gray Intensity

            // sounds
            this.music  = this.game.add.audio('forest_ambience', 1,true);
            this.effects = [
                this.game.add.audio('tick', 1, false),
                this.game.add.audio('ding', 0.8, false),
                this.game.add.audio('loose', 0.8, false)
            ];

            // start arcade physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 200;

            // build scene (item load order matters - they stack on top of each other)
            this.bgGroup = this.game.add.group();
            this.midGroup = this.game.add.group();
            // enemy group (for phyiscs, !! for enemies to be visible has to be defined after mid grp)
            //this.enemyGroup = this.game.add.group();
            //this.enemyGroup.enableBody = true;
            this.frontGroup = this.game.add.group();

            // bg far
            //this.bgTile0 = this.bgGroup.create(0,0, 'bg_z-2');
            this.bgTile0 = this.game.add.tileSprite(0, 0, this.game.stage.width, this.game.cache.getImage('bg_z-2').height, 'bg_z-2');
            this.bgTile0.scale.y = this.getBgTileScale(this.game.cache.getImage('bg_z-2').height);
            this.bgGroup.add(this.bgTile0);
            //console.log(this.game.cache.getImage('bg_z-2').height+" -> "+ this.bgTile0.scale.y+ "  TileHeight: "+this.bgTile0.height);

            // bg near
            this.bgTile1 = this.game.add.tileSprite(0, 0, this.game.stage.width, this.game.cache.getImage('bg_z-1').height, 'bg_z-1');
            this.bgTile1.scale.y = this.getBgTileScale(this.game.cache.getImage('bg_z-1').height);
            this.bgGroup.add(this.bgTile1);

            // create bird & outline and add to mid group
            this.bird = new Sprites.Bird(this.game, 200, this.game.height - this.game.height/2);
            this.midGroup.add(this.bird);
            //this.bird.body.collides(this.collisionGroupBirdEnemy); // collides with enemy

            // bg front
            this.bgTile2 = this.game.add.tileSprite(0, 0, this.game.stage.width, this.game.cache.getImage('bg_z0').height, 'bg_z0');
            this.bgTile2.scale.y = this.getBgTileScale(this.game.cache.getImage('bg_z0').height);
            this.frontGroup.add(this.bgTile2);

            // add outline to front group
            this.frontGroup.add(this.bird.getOutline());

            // score & userinfo
            var screenPosX = this.game.width-310;
            var screenPosY = 10;

            // playtime
            this.game.add.bitmapText(screenPosX+5, screenPosY+10, 'gamefont',"Time", 32);
            this.playTimeText = this.game.add.bitmapText(screenPosX+150, screenPosY+10, 'gamefont',this.playTimeString, 32);

            // score
            this.score = 0;
            this.resetScoreHelperVars();
            this.scoreIndicatorText = this.game.add.bitmapText(screenPosX+5, screenPosY+42, 'gamefont'," ", 32);
            this.scoreMultiplicatorText = this.game.add.bitmapText(screenPosX+105, screenPosY+42, 'gamefont',"x"+this.scoreMultiplicator, 32);
            this.scoreText = this.game.add.bitmapText(screenPosX+150, screenPosY+42, 'gamefont',""+this.score, 32);

            // info
            this.userInfo = this.game.add.bitmapText(0, 0, 'gamefont',"", 64);
            this.userInfo.x = this.game.width/2 - (this.userInfo.width+150);
            this.userInfo.y = this.game.height/2 - this.userInfo.height;

            // wrapper rectangle
            var graphics = this.game.add.graphics(screenPosX-4, screenPosY);
            graphics.lineStyle(5, 0xFFFFFF, 1); // width, color, alpha
            graphics.drawRect(0, 0, 290, 80); // left upper corner(x,y),width, height

            // timers
            this.startTime = this.game.time.time;
            this.scoreLettersTimer = new Utils.IntervalTimer(this.game, 2000); // 2 secs
            this.scoreTimer = new Utils.IntervalTimer(this.game, 1300);
            this.gameTimeCountDown = new Utils.CountdownTimer(this.game, 1000 * 60 * 5); // 5 min gametime
            this.enemySpawnTimer = new Utils.RandomIntervalTimer(this.game, this.MAX_ENEMY_SPAWN_TIME, 4000);
            this.enemyHitTimeout = new Utils.CountdownTimer(this.game, 0); // dont init yet
            this.gameAdjustTimer = new Utils.CountdownTimer(this.game, 1000 * 30); // 30 sec

            this.music.play();


        }

        resetScoreHelperVars()
        {
            this.scoreMultiplicator = 0;
            this.numScoreLetters = 0;
            this.maxScoreCountdown = null;

        }

        adjustDifficulty(): void
        {
            console.log("Adjusting Game Difficulty!");
            var newMax: number = this.enemySpawnTimer.getMax() * 0.8;
            var newMin: number = this.enemySpawnTimer.getMin() * 0.8;
            newMin = (newMin < this.MIN_ENEMY_SPAWN_TIME)? this.MIN_ENEMY_SPAWN_TIME : newMin;
            newMax = (newMax < newMin)? newMin : newMax;

            this.enemySpawnTimer.setMax(newMax);
            this.enemySpawnTimer.setMin(newMin);
            this.enemySpawnTimer.reInit();

            this.gameAdjustTimer.restart();
        }

        generateEnemy()
        {
            var randomSpawnHeight: number = this.rndGen.realInRange(1.0/3.0-0.1, 2.0/3.0+0.1);

            var crow: Sprites.Enemy = new Sprites.Enemy(this.game, this.game.width+500, this.game.height * randomSpawnHeight-100, this.bird);
            crow.onHit(this.enemyHit);
            this.midGroup.add(crow);
            this.frontGroup.add(crow.getOutline());

            //this.enemyGroup.add(crow);
        }

        // instance arrow function (!= prototype func) prevents
        // 'this' from belonging to calling class (e.g. Enemy.ts),
        // see https://github.com/Microsoft/TypeScript/wiki/%27this%27-in-TypeScript
        public enemyHit = () =>
        {
            //console.log("GameScreen: Enemy was hit!");
            this.effects[2].play();
            this.enemyHitTimeout.setCountdown(1000 * 2); //2 sec timeout
            this.enemyHitTimeout.restart();
            //this.bird.die();
        }

        removeTween(tween: Phaser.Tween)
        {
            this.game.tweens.removeFrom(tween);
        }


        getBgTileScale(tileHeight: number): number
        {
            var gameHeight: number = this.game.height;

            if (tileHeight >= gameHeight) return gameHeight/tileHeight;
            else return tileHeight/gameHeight;

        }

        update()
        {
            // enable collisions between the bird and the ground
            //this.game.physics.arcade.collide(this.bird, this.game.world.bounds.bottom, this.deathHandler, null, this);

            if (this.enemySpawnTimer.checkInterval()) this.generateEnemy();

            this.calcScore();
            this.updateScoreDisplay();
            // adjust Game Difficulty
            if (!this.gameAdjustTimer.isRunning()) this.adjustDifficulty();


            if (this.bird.body.bottom == this.game.world.bounds.bottom || !this.gameTimeCountDown.isRunning())
            {
                this.deathHandler();
                return;
            }

            this.bgTile0.tilePosition.x -= 4;
            this.bgTile1.tilePosition.x -= 5;
            this.bgTile2.tilePosition.x -= 6;

            this.updateTimer();
        }

        /* DEBUG (Bounding Boxes etc.) */
        /*
        render()
        {

            this.game.debug.bodyInfo(this.bird, 32, 32);

            var bird = this.midGroup.getAt(0);
            var crow = this.midGroup.getAt(1);

            if (bird != null) this.game.debug.body(bird);
            if (crow != null) this.game.debug.body(crow);

        }
        */
        

        calcScore()
        {
            // check if bird is inside certain area (middle 1/3)
            var birdMiddle:number =  this.bird.top + this.bird.height/2;
            if (birdMiddle > this.game.height * (2/3) ||
                     birdMiddle < this.game.height * (1/3) ||
                     this.enemyHitTimeout.isRunning())
            {

                this.game.stage.filters = [this.grayFilter]; // filter whole game

                // bird hit enemy?
                if (this.enemyHitTimeout.isRunning())
                {
                    var displayInfo: string = ""+this.enemyHitTimeout.getCountdownValueSeconds();
                    this.userInfo.setText(displayInfo);

                    //console.log(""+this.enemyHitTimeout.getCountdownValueSeconds());
                }
                else
                {

                    /*if (this.userInfo.text != " " &&
                        (this.userInfo.text != "Speed Up!" ||
                         this.userInfo.text != "Slow Down!")) this.userInfo.setText(" ");*/

                    var message: string = (birdMiddle > this.game.height * (2/3))? "Speed Up!" : "Slow Down!";
                    if (this.userInfo.text != message) this.userInfo.setText(" ");
                    this.displayUserInfo( message );
                }

                this.resetScoreHelperVars();
                this.scoreLettersTimer.reInit();

                // bird is in grayzone only add half the score
                if (this.scoreTimer.checkInterval()) this.score +=  (this.baseScore/2);
            }
            else
            {
                this.game.stage.filters = null; // delete filters
                this.hideUserInfo();

                if (this.scoreMultiplicator == 0) {
                    this.scoreMultiplicator = 1;
                    this.playScoreTween();
                    this.effects[1].play();
                }

                if (this.scoreLettersTimer.checkInterval() && (this.scoreMultiplicator < this.multiplicatorColors.length))
                {
                    if (this.numScoreLetters < this.multiplicatorColors.length-1)
                    {
                        this.stopScoreTween(null);
                        this.numScoreLetters++;
                        this.effects[0].play();
                    }
                    else
                    {
                        this.numScoreLetters = 0;
                        this.scoreMultiplicator++;
                        this.playScoreTween();
                        this.effects[1].play();
                    }

                }
                else
                {
                    if (this.scoreMultiplicator == this.multiplicatorColors.length)
                    {
                        if (this.maxScoreCountdown == null) this.maxScoreCountdown = new Utils.CountdownTimer(this.game, 3000);
                        else this.stopScoreTween(this.maxScoreCountdown);
                    }
                }

                // bird is in normal zone add full score
                if (this.scoreTimer.checkInterval()) this.score +=  (this.baseScore * this.scoreMultiplicator);

            }
        }

        displayUserInfo(message:string)
        {
            if (this.userInfo.text == " ")
            {
                this.effects[2].play();
                this.userInfo.setText(message);
                this.userInfo.alpha=0;
                this.game.add.tween(this.userInfo).to({alpha: 1}, 400, Phaser.Easing.Linear.None, true, 0, 150, true);
                //this.userInfo.tint = 0xff0000;
            }
        }

        hideUserInfo()
        {
            this.userInfo.setText("");
            this.userInfo.alpha = 1;
            this.game.tweens.removeFrom(this.userInfo);
        }

        playScoreTween()
        {
            this.scoreIndicatorText.alpha = 0;
            this.scoreMultiplicatorText.alpha = 0;
            this.scoreText.alpha=0;
            this.game.add.tween(this.scoreIndicatorText).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true, 0, 150, true);
            this.game.add.tween(this.scoreMultiplicatorText).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true, 0, 150, true);
            this.game.add.tween(this.scoreText).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true, 0, 150, true);
        }

        stopScoreTween(countDown: Utils.CountdownTimer)
        {
            if (countDown !== null)
            {
                if (countDown.isRunning()) return;
            }

            this.scoreIndicatorText.alpha = 1;
            this.scoreMultiplicatorText.alpha = 1;
            this.scoreText.alpha= 1;
            this.game.tweens.removeFrom(this.scoreIndicatorText);
            this.game.tweens.removeFrom(this.scoreMultiplicatorText);
            this.game.tweens.removeFrom(this.scoreText);
        }


        updateScoreDisplay()
        {
            this.scoreText.setText(""+this.toInt(this.score));
            var currentMultiplicator = this.scoreMultiplicator-1;
            var scoreString = (this.numScoreLetters == 0) ? this.scoreWord : this.scoreWord.substring(0, this.numScoreLetters);
            this.scoreIndicatorText.setText(scoreString+" ");

            this.scoreMultiplicatorText.setText("x"+this.scoreMultiplicator);
            this.scoreText.tint =  this.multiplicatorColors[currentMultiplicator];
            this.scoreIndicatorText.tint = (this.numScoreLetters == 0) ? this.multiplicatorColors[currentMultiplicator] :this.multiplicatorColors[currentMultiplicator+1];
            this.scoreMultiplicatorText.tint = this.multiplicatorColors[currentMultiplicator];
        }

        deathHandler()
        {
            this.playTimeText.setText("DEATH");
            this.game.stage.filters = null; // delete filters
            var endScore: number = this.toInt(this.score);
            var endTime: string = this.getFormattedTime(this.toInt(this.game.time.elapsedSecondsSince(this.startTime)));
            this.game.state.states['GameOverScreenState'].setTotalTime(endTime);
            this.game.state.states['GameOverScreenState'].setScore(endScore);            
            this.sound.stopAll();
            //var failSoundIndex:number = this.rndGen.integerInRange(2, this.effects.length-1);
            //this.effects[3].play();
            // clean up bird keys (for highscore input)
            this.bird.removeKeys();
            this.bird.die();
            this.game.state.start("GameOverScreenState");
        }


        updateTimer() {

            //var elapsedSeconds = this.toInt(this.game.time.elapsedSecondsSince(this.startTime));

            var elapsedSeconds = this.toInt(this.gameTimeCountDown.getCountdownValueSeconds());

            this.playTimeString = this.getFormattedTime(elapsedSeconds);
            this.playTimeText.setText(this.playTimeString);

        }

        getFormattedTime(timeInSeconds: number)
        {
            var elapsedHours = this.toInt(timeInSeconds / (60 * 60));
            if (elapsedHours > 0)
            {
                timeInSeconds -= elapsedHours * 60 * 60;
            }
            var elapsedMinutes =  this.toInt(timeInSeconds / 60);
            if (elapsedMinutes > 0)
            {
                timeInSeconds -= elapsedMinutes * 60;
            }

            // add 0s for non double digit values
             return (elapsedHours > 9? "" : "0") + elapsedHours + ":" +
                (elapsedMinutes > 9? "" : "0") + elapsedMinutes + ":" +
                (timeInSeconds > 9? "" : "0") + timeInSeconds;
        }

        toInt(value) { return ~~value; }

    }
}

