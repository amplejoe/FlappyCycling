/// <reference path="../phaserLib/phaser.d.ts"/>
module Config
{
    var ASSETS_PATH = "assets/";
    var GFX_PATH = ASSETS_PATH+"gfx/";
    var SPRITE_SHEETS_PATH = ASSETS_PATH+"spritesheets/";
    var FONTS_PATH = ASSETS_PATH+"fonts/";

    export function getAssetsPath()
    {
        return ASSETS_PATH;
    }

    export function getGfxPath()
    {
        return GFX_PATH;
    }

    export function getSpriteSheetsPath()
    {
        return SPRITE_SHEETS_PATH;
    }

    export function getFontsPath()
    {
        return FONTS_PATH;
    }

}



