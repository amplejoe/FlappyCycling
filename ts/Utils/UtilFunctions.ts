/// <reference path="../../phaserLib/phaser.d.ts"/>
module Utils
{
    export class UtilFunctions
    {
        /**
         * Returns a random number between min (inclusive) and max (exclusive)
         */
        static getRandomArbitrary(min: number, max: number): number
        {
            return Math.random() * (max - min) + min;
        }

        static getProportionalScale(gameSize: number, assetSize: number): number
        {
            if (assetSize >= gameSize) return gameSize/assetSize;
            else return assetSize/gameSize;
        }

        static getHighScoresTable(): string
        {
            var highScoreSize =  parseInt(localStorage["flappy.highscore.count"]);
            var highscoresString = "<table id='highscoreTable' class='centered'><thead><tr><th>Player</th><th>Score</th><th>Time</th></tr></thead>";

            for (var i=0;i<highScoreSize;i++)
            {
                var oddClass = (i % 2 == 0)? "" : " class='odd'";
                highscoresString += "<tbody><tr"+oddClass+">";
                highscoresString += "<th>"+(i+1)+"</th>";
                highscoresString += "<th>"+localStorage["flappy.highscore."+i+".email"]+"</th>";
                highscoresString += "<td>"+localStorage["flappy.highscore."+i+".score"]+"</td>";
                highscoresString += "<td>"+localStorage["flappy.highscore."+i+".time"]+"</td>";
                highscoresString += "</tr></tbody>";
            }

            highscoresString += "<tfoot><th>Total</th><td colspan='2'>"+highScoreSize+" Scores</td></tfoot></table>";

            return highscoresString;
            //document.getElementById('highscores').innerHTML = highscoresString;
        }

        static getRank(score:number): number
        {
            var highscoreEntryCountString = localStorage["flappy.highscore.count"];

            var id = 0;

            if (highscoreEntryCountString == null)
            {
                localStorage["flappy.highscore.count"] = 0;
            }
            else
            {
                id = parseInt(highscoreEntryCountString);
            }

            var currentHighscoreCount = parseInt(localStorage["flappy.highscore.count"]);

            if (currentHighscoreCount > 0)
            {
                var insert: boolean = false;
                for (var i=0;i<currentHighscoreCount;i++)
                {
                    var curScore: number = parseInt(localStorage["flappy.highscore."+i+".score"]);
                    if (score >= curScore)
                    {
                        id = i;
                        insert = true;
                        break;
                    }

                }
            }

            return (id+1);
        }

        static storeEmail(email: string, rank: number): void
        {
            // local storage numbering starts with 0
            localStorage["flappy.highscore."+(rank-1)+".email"] = email;
        }

        static addHighscoreEntrySorted(score: number, time:string ): number
        {
            var rank = this.getRank(score); // must be first instruction: localstorage is possibly altered in there
            var currentHighscoreCount = parseInt(localStorage["flappy.highscore.count"]);
            var insertPos = rank-1;
            // only omit shift on highest rank (insert at end)
            if (insertPos < currentHighscoreCount)
            {
                // shift scores to make room for new one
                for (var i = (currentHighscoreCount-1); i >= insertPos; i--)
                {
                    //console.log(i+" (count: "+currentHighscoreCount+")");
                    localStorage["flappy.highscore."+(i+1)+".email"] = localStorage["flappy.highscore."+i+".email"];
                    localStorage["flappy.highscore."+(i+1)+".score"] = localStorage["flappy.highscore."+i+".score"];
                    localStorage["flappy.highscore."+(i+1)+".time"] = localStorage["flappy.highscore."+i+".time"];
                }
            }

            
            
            // add current score
            //console.log("insertpos:" + insertPos);
            localStorage["flappy.highscore."+insertPos+".email"] = "unknown";
            localStorage["flappy.highscore."+insertPos+".score"] = score;
            localStorage["flappy.highscore."+insertPos+".time"] = time;
            localStorage["flappy.highscore.count"] = currentHighscoreCount + 1;
            return (rank);
        }


        static toInt(value) { return ~~value; }
    }
}

