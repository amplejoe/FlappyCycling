/// <reference path="Timer.ts"/>
/// <reference path="UtilFunctions.ts"/>
module Utils
{
    export class RandomIntervalTimer extends Timer
    {
        max: number; // ms
        min: number; // ms

        rndInterval: number; // set time between min and max

        intervalCheckPoint: number; // last checkpoint for interval

        constructor(game: Phaser.Game, max: number, min: number)
        {
            super(game);
            this.setMax(max);
            this.setMin(min);
            this.reInit();
        }

        setRndInterval()
        {
            this.rndInterval = Utils.UtilFunctions.getRandomArbitrary(this.min, this.max);
        }

        setIntervalCheckPoint(val: number)
        {
            this.intervalCheckPoint = val;
        }

        reInit()
        {
            this.restart();
            this.setIntervalCheckPoint(this.startTime);
            this.setRndInterval();
            //console.log("assigning new (rndTime: "+this.rndInterval);
        }

        setMax(max: number) {this.max = max;}
        setMin(min: number) {this.min = min;}

        getMax(): number {return this.max;}
        getMin(): number {return this.min;}

        checkInterval(): boolean
        {
            var elapsed: number = this.game.time.elapsedSince(this.intervalCheckPoint);

            if (elapsed >= this.rndInterval)
            {
                this.reInit();

                return true;
            }

            return false;
        }
    }
}


