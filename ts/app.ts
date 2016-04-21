/// <reference path="references.d.ts"/>
/// <reference path="config.ts"/>
class SimpleFlappyBird
{

    constructor(width:number, height:number)
    {
        //console.log(width+" "+height);
        if (width > 4000) width = 4000;
        if (height > 1153) height = 1153;

        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', {create: this.create, preload: this.preload });
    }

    game: Phaser.Game;

    preload()
    {

        var line1 = "Loading...";
        var style = { font: "48px Arial", fill: "#ff0000", textAlign: "center"};       
        var text: Phaser.Text = this.game.add.text(10, 10, line1, style);
        text.anchor.set(0.5,0.5);
        text.position.set(this.game.width/2,this.game.height/2);

        //var line1 = "Loading...";
        //var text: Phaser.BitmapText = this.game.add.bitmapText(this.game.width-140, 10, 'gamefont',line1, 32);
        //text.x = this.game.width/2 - (text.width/2);
        //text.y = this.game.height/2 - (text.height/2);

        // fonts
        var fontsPath = Config.getFontsPath();
        //this.game.load.bitmapFont('gamefont', fontsPath+'caladea_bold_24.png', fontsPath+'caladea_bold_24.xml');
        this.game.load.bitmapFont('gamefont', fontsPath+'nokia.png', fontsPath+'nokia.xml');

        // gfx
        var gfxPath = Config.getGfxPath();
        // background
        this.game.load.image('bg_z-2', gfxPath+'bg/z-2.png');
        this.game.load.image('bg_z-1', gfxPath+'bg/z-1.png');
        this.game.load.image('bg_z0', gfxPath+'bg/z0.png');
        // title
        this.game.load.image('title', gfxPath+'title.png');
        this.game.load.image('cc', gfxPath+'by-nc-sa.jpg');

        // sprite sheets
        var spritePath = Config.getSpriteSheetsPath();
        this.game.load.atlasJSONHash("BIRD_FLYING", spritePath+"bird.png", spritePath+"bird_flying.json");
        this.game.load.atlasJSONHash("BIRD_OUTLINE", spritePath+"bird_outline.png", spritePath+"bird_outline.json");
        this.game.load.atlasJSONHash("CROW_ENEMY", spritePath+"crow.png", spritePath+"crow.json");
        this.game.load.atlasJSONHash("CROW_OUTLINE", spritePath+"crow_outline.png", spritePath+"crow_outline.json");

        // filters
        this.game.load.script('grayfilter', 'phaserLib/Gray.js');

        // audio
        this.game.load.audio("forest_ambience", "assets/sound/Forest_Ambience.mp3");
        this.game.load.audio("flap", "assets/sound/bird_flap.mp3");
        this.game.load.audio("splat", "assets/sound/groundhit.mp3");
        this.game.load.audio("crow", "assets/sound/crow.wav");
        this.game.load.audio("tick", "assets/sound/tick.mp3");
        this.game.load.audio("ding", "assets/sound/ding.mp3");
        this.game.load.audio("loose", "assets/sound/loose.mp3");
        this.game.load.audio("hit", "assets/sound/groan.wav");
        
    }

    create()
    {
        // show title screen
        this.game.state.add("TitleScreenState", States.TitleScreenState, true);

        // game screen
        this.game.state.add("GameScreenState", States.GameScreenState, false);

        // game over screen
        this.game.state.add("GameOverScreenState", States.GameOverScreenState, false);

        // scale according to window
        this.game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    }

    public getGame()
    {
        return this.game;
    }

}

// global game variable
var simpleflappy;

window.onload = () =>
{
    var height = window.innerHeight;
    var width = window.innerWidth;
    simpleflappy = new SimpleFlappyBird(width, height);

};

var resizeId;

window.onresize = function(event)
{
    // timeout for window resizing
    clearTimeout(resizeId);
    resizeId = setTimeout(finishedResize, 500);

};

function finishedResize()
{
    //console.log("window was resized!");
    location.reload(); // reload page to adjust to resolution
}

// communicates with gameoverstate (index.html form -> GameoverScreenstate.setEmail)
function setEmail() { // declare a function in the global namespace
    // find gameoverstate in game (must exist)
    var game = simpleflappy.getGame();
    game.state.states['GameOverScreenState'].setEmail(); // gameOverscreenstate should exist
    //game.state.start('GameOverScreenState');
    return false; // prevents form submit
}
