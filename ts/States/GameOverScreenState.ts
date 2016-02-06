/// <reference path="../../phaserLib/phaser.d.ts"/>
module States
{
    export class GameOverScreenState extends Phaser.State
    {
        game: Phaser.Game;
        START_BUTTON: Phaser.Key;

        totalTime: string = "00:00:00";
        score: number = 0;
        rank: number = 0;

        gameOverTime: number;

        waitTime: number = 5;

        retryText: Phaser.BitmapText;

       setTotalTime(time:string)
       {
            this.totalTime = time;
       }

        setScore(score:number)
        {
            this.score = score;
        }

        setRank(rank:number)
        {
            this.rank = rank;
        }

        create()
        {
            var line1 = "Game Over - Your Score:";
            var tex1: Phaser.BitmapText = this.game.add.bitmapText(0, 0, 'gamefont',line1, 64);
            tex1.x = this.game.width/2 - tex1.width/2;
            tex1.y = 0+ this.game.height * 0.1;
            tex1.tint = 0xFF0000;


            var line2 = "Your Score: "+this.score+" (Rank: "+this.rank+")\nPlaytime: "+this.totalTime;
            var tex2: Phaser.BitmapText = this.game.add.bitmapText(0, 0, 'gamefont',line2, 64);
            tex2.x = this.game.width/2 - tex2.width/2;
            tex2.y = 0+ this.game.height * 0.4;
            tex2.tint = 0xFF0000;

            var line3 = "Continue cycling to retry...";
            this.retryText = this.game.add.bitmapText(0, 0, 'gamefont',line3, 64);
            //tex3.width = 250;
            this.retryText.x = this.game.width/2 - this.retryText.width/2;
            this.retryText.y = 0+ this.game.height * 0.8;
            //var bmTextStyle = { fill: "#000000", wordWrap: "true", wordWrapWidth: "100"};
            //tex3.setStyle(bmTextStyle);
            this.retryText.tint = 0xFF0000; // color
            this.retryText.alpha = 0;
            this.game.add.tween(this.retryText).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

            //var style = { font: "48px Arial", fill: "#ff0000", textAlign: "center"};
            //this.game.add.text(10, 10, line1, style);
            //this.game.add.text(10, 150, line2, style);
            //this.game.add.text(10, 380, line3, style);

            this.gameOverTime = this.game.time.time;
        }

        update()
        {
            var elapsedSeconds = this.toInt(this.game.time.elapsedSecondsSince(this.gameOverTime));

            if (elapsedSeconds >= this.waitTime)
            {
                this.START_BUTTON = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
                this.START_BUTTON.onDown.add(GameOverScreenState.prototype.buttonPressed, this);
            }
        }

        buttonPressed()
        {
            this.game.tweens.removeFrom(this.retryText);
            this.game.state.start("GameScreenState");
        }

        toInt(value) { return ~~value; }

    }
}