/// <reference path="Timer.ts"/>
module Utils
{
    export class CountdownTimer extends Timer
    {
        countdown: number; // ms

        constructor(game: Phaser.Game, countdown: number)
        {
            super(game);
            this.setCountdown(countdown);
        }

        setCountdown(countdown: number) {this.countdown = countdown;}

        getCountdownValue():number
        {
            var elapsed: number = this.getCurrentTimeMS();

            return (this.countdown-elapsed);
        }

        getCountdownValueSeconds():number
        {
            var elapsed: number = this.getCurrentTimeMS();

            return (this.countdown-elapsed) / 1000;
        }

        isRunning(): boolean
        {
            var elapsed: number = this.getCurrentTimeMS();

            if (elapsed >= this.countdown)
            {
                return false;
            }
            return true;
        }

    }
}

