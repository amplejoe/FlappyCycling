/// <reference path="../../phaserLib/phaser.d.ts"/>
module Sprites
{
    export class Bird extends Phaser.Sprite
    {
        public static MAX_SPEED: number = 30; // 30 fps

        game: Phaser.Game;
        animSpeed: number;

        FLY_BUTTON: Phaser.Key;
        LEFT_BUTTON: Phaser.Key;
        RIGHT_BUTTON: Phaser.Key;
        maxLeftSpeed: number = 15;
        currentXSpeed:number;
        maxRightSpeed: number = 10;

        effects: Array<Phaser.Sound>;

        // outline
        outline: Phaser.Sprite;


        constructor(game:Phaser.Game,x:number,y:number)
        {
            super(game,x,y,"BIRD_FLYING", 0); // frame 0

            this.game = game;
            this.animSpeed = 10; // 10 fps

            // load outline sprite
            this.outline = new Phaser.Sprite(this.game, x, y, 'BIRD_OUTLINE', 0);
                //this.game.add.sprite(200,birdStartHeight,'BIRD_OUTLINE');

            // keys
            this.FLY_BUTTON = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
            this.LEFT_BUTTON = this.game.input.keyboard.addKey(Phaser.Keyboard.Y);
            this.RIGHT_BUTTON = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
            this.FLY_BUTTON.onDown.add(Sprites.Bird.prototype.flap, this);
            //this.LEFT_BUTTON.onDown.add(Sprites.Bird.prototype.flyLeft, this);
            //this.RIGHT_BUTTON.on.add(Sprites.Bird.prototype.flyRight, this);

            this.effects = [
                this.game.add.audio('flap', 0.5,false),
                this.game.add.audio('splat',1,false)
            ];

            this.currentXSpeed = 0;

            // arcade physics bird
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.collideWorldBounds = true;
            this.body.bounce.set(0.4);
            this.body.setSize(78,86, 10, 0);
            // for collisions
            //this.enableBody = true;
            //this.physicsBodyType = Phaser.Physics.ARCADE;

            // arcade physics outline
            this.game.physics.enable(this.outline, Phaser.Physics.ARCADE);
            this.outline.body.collideWorldBounds = true;
            this.outline.body.bounce.set(0.4);
            this.outline.body.setSize(78,86, 10, 0);

            // add bird & outline to game
            var birdStartHeight = (this.game.height/2) - (this.height/2);
            this.y = birdStartHeight ;
            this.outline.y = birdStartHeight;

            this.Animate();

            this.game.add.existing(this);
            this.game.add.existing(this.outline);

            //this.anchor.set(0.0,0.5); // default sprite anchor point: top left corner

        }

        flap(): void
        {
            this.body.velocity.setTo(0, -70);
            this.outline.body.velocity.setTo(0, -70);
            if (!this.effects[0].isPlaying) this.effects[0].play();
        }


        flyTo(direction:number): void
        {

            this.x += this.currentXSpeed * direction;
            this.outline.x += this.currentXSpeed * direction;

        }

        getOutline(): Phaser.Sprite
        {
            return this.outline;
        }

        update()
        {
            if (this.LEFT_BUTTON.isDown && this.RIGHT_BUTTON.isDown)
            {
                this.currentXSpeed = 0;
            }
            else if (this.LEFT_BUTTON.isDown) {
                this.currentXSpeed = this.maxLeftSpeed;
                this.flyTo(-1);
            }
            else if (this.RIGHT_BUTTON.isDown) {
                this.currentXSpeed = this.maxRightSpeed;
                this.flyTo(1);
            }

            // bird fall
            //this.y -= 10 * (60/this.game.time.elapsedMS); // smooth out by amount of update since current frame
        }

        Animate()
        {
            // bird
            //this.loadTexture("BIRD_FLYING",0);
            this.animations.add("fly"); // whole sheet = fly animation
            this.animations.play("fly", this.animSpeed, true); // true -> loop forever
            this.outline.animations.add("fly_outline"); // whole sheet = fly animation
            this.outline.animations.play("fly_outline", 10, true);
            this.animations.currentAnim.speed = this.animSpeed;

        }

        die()
        {
            this.effects[1].play();
            this.destroy();
        }

    }

}
