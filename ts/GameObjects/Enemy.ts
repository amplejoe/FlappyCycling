/// <reference path="../../phaserLib/phaser.d.ts"/>
/// <reference path="../GameObjects/Bird.ts"/>
module Sprites
{
    export class Enemy extends Phaser.Sprite
    {

        game: Phaser.Game;
        rndGen: Phaser.RandomDataGenerator;

        id: number;

        animSpeed: number = 10;

        // callbacks
        onHitFunction: Function;

        // sound
        effects: Array<Phaser.Sound>;

        // rnd vars
        flyDestination: number;
        minYDiff: number; // minimal height difference (enemies should not fly too straight)
        flyDuration: number;
        flySpeed: number;
        maxFlySpeed: number = 6000;

        tweens: Array<Phaser.Tween>;

        // outline
        outline: Phaser.Sprite;
        outlineTweens: Array<Phaser.Tween>;

        bird: Sprites.Bird;

        isHit: boolean;

        constructor(game:Phaser.Game,x:number,y:number, bird: Sprites.Bird)
        {

            super(game,x,y,"CROW_ENEMY", 0); // frame 0

            this.bird = bird;

            this.effects = [
                this.game.add.audio('crow', 0.5,false),
                this.game.add.audio('splat',1,false),
                this.game.add.audio('hit',0.5,false)
            ];

            this.anchor.setTo(.5, 1); //so it flips around its middle
            this.scale.x = -1; //flipped

            this.outline = this.game.add.sprite(x,y, "CROW_OUTLINE");
            this.outline.anchor.setTo(.5, 1); //so it flips around its middle
            this.outline.scale.x = -1; //flipped

            // physics
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.game.physics.enable(this.outline, Phaser.Physics.ARCADE);
            this.body.moves = false; // necessary so body does not fall
            this.outline.body.moves = false;
            this.body.setSize(72,60, -20, -20); // not needed for outline

            var seed: number = this.game.time.time;
            this.rndGen = new Phaser.RandomDataGenerator([seed]);

            this.game = game;

            this.minYDiff = this.game.world.height * (1.0/5.0);

            this.tweens = new Array();
            this.outlineTweens = new Array();

            this.randomizeProperties();

            // temp random id
            this.id = this.rndGen.integerInRange(0,100);
            this.isHit =false;

            this.startAttack();
            this.checkWorldBounds = true; // important for events concerning worldbounds
            this.events.onEnterBounds.add(this.setDeathSentence, this); // starts out of bounds

        }



        // sets bird to be killed on out of bounds
        setDeathSentence(): void
        {
            //console.log(this.id + " enemy entered scene!");
            this.effects[0].play();
            this.events.onOutOfBounds.add(this.outOfBoundsDie, this);
        }

        randomizeProperties()
        {
            //this.flyDestination = this.rndGen.realInRange(1.0/3.0, 2.0/3.0);
            // flyheight calc
            var coin = this.rndGen.integerInRange(0, 1);
            //var direction = (coin < 1) ? -1 : 1;          
            // middle third of screen bounds   
            var lowerBound = this.game.world.height * (1.0/3.0);
            var upperBound = this.game.world.height * (2.0/3.0);
            this.flyDestination = this.rndGen.realInRange(lowerBound,upperBound);

            
            if (Math.abs(this.flyDestination - this.y) < this.minYDiff) 
            {
                if (this.flyDestination < this.y) this.flyDestination -= this.minYDiff;
                else this.flyDestination += this.minYDiff;
            }

            this.flyDuration = this.rndGen.integerInRange(1000, 3000);
            this.flySpeed = this.rndGen.integerInRange(3000, this.maxFlySpeed);
        }

        getOutline(): Phaser.Sprite
        {
            return this.outline;
        }

        getId(): number
        {
            return this.id;
        }

        hit(): void
        {
            if (!this.isHit) this.isHit = true;
            else return;

            //console.log("Bird collided with "+this.id);
            this.game.tweens.remove(this.tweens[0]);
            this.game.tweens.remove(this.tweens[1]);
            this.game.tweens.remove(this.outlineTweens[0]);
            this.game.tweens.remove(this.outlineTweens[1]);

            // TODO: better fall & die animation
            var recoilVelocityX: number = (this.maxFlySpeed - this.flySpeed)/10;
            var recoilVelocityY: number = this.rndGen.integerInRange(100, 300);
            this.body.moves = true; // body can fall now
            this.body.velocity.setTo(recoilVelocityX, recoilVelocityY);
            this.body.rotation = this.game.physics.arcade.angleToPointer(this) - Math.PI/2;
            this.outline.body.moves = true;
            this.outline.body.velocity.setTo(recoilVelocityX, recoilVelocityY);

            //this.onHitFunction();
            this.effects[2].play();
            this.onHitFunction();

            //this.outline.destroy();
            //this.destroy();
        }

        onHit(func: Function)
        {
            this.onHitFunction = func;
        }

        update()
        {

            this.game.physics.arcade.overlap(this, this.bird, this.hit, null, this);

            // bird fall
            //this.y -= 10 * (60/this.game.time.elapsedMS); // smooth out by amount of update since current frame
        }


        startAttack()
        {
            // sprite & outline animations
            this.startAnimation(this,"fly_enemy");
            this.startAnimation(this.outline,"fly_enemy_outline");

            // tweens
            this.createTweens(this, this.tweens);
            this.createTweens(this.outline, this.outlineTweens);

            // autodestroy when enemy has flown by (-> possible but outofbounds method better)
            /*
            this.tweens[1].onLoop.add( function() {
                // destroy tween if not visible any more
                if (this.x <= (0-200) || this.y > (this.game.height + 200))
                {
                    this.outOfBoundsDie();
                }
            }, this);
            */

        }

        startAnimation(sprite: Phaser.Sprite, animString: string): void
        {
            sprite.animations.add(animString);
            sprite.animations.play(animString, this.animSpeed, true);
        }

        createTweens(sprite: Phaser.Sprite, tweens: Array<Phaser.Tween>): void
        {
            //to(properties: any, duration?: number, ease?: Function, autoStart?: boolean, delay?: number, repeat?: number, yoyo?: boolean)
            tweens[0] = this.game.add.tween(sprite).to({ x: 0-500}, this.flySpeed, Phaser.Easing.Linear.None, true);
            //tweens[1] = this.game.add.tween(sprite).to({ y: this.game.world.height*this.flyDestination+this.height}, this.flyDuration, Phaser.Easing.Quadratic.InOut, true, 1000, -1, true);
            tweens[1] = this.game.add.tween(sprite).to({ y: this.flyDestination}, this.flyDuration, Phaser.Easing.Quadratic.InOut, true, 1000, -1, true);
            //console.log("enemy.y("+this.y+") -> "+(this.flyDestination)+"  MIN: "+this.minYDiff);
        }

        outOfBoundsDie()
        {
            this.game.tweens.remove(this.tweens[0]);
            this.game.tweens.remove(this.tweens[1]);
            this.game.tweens.remove(this.outlineTweens[0]);
            this.game.tweens.remove(this.outlineTweens[1]);
            //console.log(this.id + " is dying...");
            if (this.body.moves) this.effects[1].play();
            this.outline.destroy();
            this.destroy();
        }



    }

}
