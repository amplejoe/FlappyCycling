/// <reference path="../../phaserLib/phaser.d.ts"/>
/// <reference path="../Utils/UtilFunctions.ts"/>
module States {

    export class TitleScreenState extends Phaser.State
    {
        game: Phaser.Game;

        START_BUTTON: Phaser.Key;

        title: Phaser.TileSprite;

        cycleText: Phaser.BitmapText;

        // to go fullscreen: Press Browser fullscreen button (F11) - game will automatically be refreshed
        //fullScreenKey: Phaser.Key;

        create()
        {

            this.title = this.game.add.tileSprite(0, 0, this.game.cache.getImage('title').width, this.game.cache.getImage('title').height, 'title');
            this.title.scale.x = Utils.UtilFunctions.getProportionalScale(this.game.width, this.game.cache.getImage('title').width);
            this.title.scale.y = Utils.UtilFunctions.getProportionalScale(this.game.height, this.game.cache.getImage('title').height);

            var line1 = "Flappy Bird - Ergometer Edition";
            var line2 = "Start cycling to begin!";
            var line3 = "Created by\nAndreas Leibetseder";
            var line4 = "GFX (opengameart.org):\nMoikMellah (Bird), Redshrike (Crow)" +
                        "\nTiny Speck (BG), extracted by jakegamer (orig. from public domain 'Glitch' game)" +
                        "\nSFX (freesound.org): Rick Hoppmann (Ambience), Gabriel Killhour (Ding), Robinhood76 (Screech)" +
                        "\njorickhoofd (Tick), AgentDD (Wings), J.Zazvurek (Fall), GameAudio (Loose), davidworksonline (Crow)";
            //var style = { font: "48px Arial", fill: "#ff0000", textAlign: "center"};
            var tex1: Phaser.BitmapText = this.game.add.bitmapText(0, 0, 'gamefont',line1, 64);
            tex1.x = this.game.width/2 - tex1.width/2;
            tex1.y = 0+ this.game.height * 0.1;

            this.cycleText = this.game.add.bitmapText(0, 0, 'gamefont',line2, 64);
            this.cycleText.x = this.game.width/2 - this.cycleText.width/2;
            this.cycleText.y = 0+ this.game.height * 0.4;
            this.cycleText.alpha = 0;
            this.game.add.tween(this.cycleText).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

            var tex3: Phaser.BitmapText = this.game.add.bitmapText(0, 0, 'gamefont',line3, 24);
            //tex3.width = 250;
            tex3.x = this.game.width - tex3.width - 36;
            tex3.y = 0+ this.game.height * 0.94;
            //var bmTextStyle = { fill: "#000000", wordWrap: "true", wordWrapWidth: "100"};
            //tex3.setStyle(bmTextStyle);
            tex3.tint = 0x111111; // color

            var tex4: Phaser.BitmapText = this.game.add.bitmapText(0, 0, 'gamefont',line4, 24);
            tex4.x = 27;
            tex4.y = 0+ this.game.height * 0.875;
            tex4.tint = 0x111111; // color


            //this.game.add.text(10, 150, line2, style);


            this.START_BUTTON = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
            this.START_BUTTON.onDown.add(TitleScreenState.prototype.buttonPressed, this);

            //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL; //resize your window to see the stage resize too
            //this.fullScreenKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
            //this.fullScreenKey.onDown.add(this.toggleFull, this);

            console.log("Local Storage supported: "+this.supports_html5_storage());

        }

        buttonPressed()
        {
            this.game.tweens.removeFrom(this.cycleText); // remove cylcetext tween
            this.game.state.start("GameScreenState");
        }

        supports_html5_storage() {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        }

        toggleFull()
        {
            //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            if (this.game.scale.isFullScreen)
            {
               this.game.scale.stopFullScreen();
            }
            else
            {
                this.game.scale.startFullScreen();
            }

            this.game.scale.refresh();
            //console.log(this.game.width+" "+this.game.height);
        }

    }
}