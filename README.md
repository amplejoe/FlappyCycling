# FlappyCycling

![Screenshot](screenshots/title.png)

---
A flappy bird clone used in combination with input from an ergometer. It has been part of a master thesis study conducted at the [Alpen-Adria University](https://www.aau.at/) (AAU), Klagenfurt. The goal of the game is to control a bird via cycling on an ergometer and dodging enemy birds flying towards the player by using the ergometer's pulse handles. The goal is to fly for 5 minutes, stay in the middle third of the screen and rack up as much points as possible. Points are gathered via a multiplier that gets reset every time the screen is grayed out, i.e. the bird exits the designated screen area or is hit by an enemy bird. Touching the ground triggers an instant game over.

Try the game at [github.io](http://amplejoe.github.io/FlappyCycling/).

## Controls
Keystrokes in the full set up are generated by an ergometer hooked up to an Arduino Leonardo. It can therefore simply be tested using a plain keyboard. For Arduino input conversion see [FitnessInputConverterArduino](https://github.com/amplejoe/FitnessInputConverterArduino) repository.

* 'x' controls the bird height (gives an y-axis boost)
* 'y' lets the bird fly backwards, 'c' forwards on the x-axis

## Assets
All assets used are under creative commons licenses, that allow non-commercial use.

GFX [OpenGameArt](http://opengameart.org):
* MoikMellah (Bird)
* Redshrike (Crow) 
* Tiny Speck (BG), extracted by jakegamer (originally from public domain 'Glitch' game)

SFX [FreeSound](http://freesound.org): 
* Rick Hoppmann (Ambience)
* Gabriel Killhour (Ding)
* Robinhood76 (Screech)
* jorickhoofd (Tick)
* AgentDD (Wings) 
* J.Zazvurek (Fall) 
* GameAudio (Loose)
* davidworksonline (Crow)

## Technology
The Game was written in Phaser, a HTML 5 media framework based on JavaScript. IDEAs WebStorm was used as an IDE and all Classes were written in TypeScript, which is a free open source programming language developed and maintained by Microsoft. Typescript is a superset of JavaScript and aims at making JavaScript programming more object-oriented.

## How to compile and run

Clone it from the github repo (or fork, download ZIP, whatever you prefer). Then make sure you've got [node.js](https://nodejs.org/en/) and [typescript](http://www.typescriptlang.org/) installed. Btw. it's much easier to install node.js first ;) From there it's easy if you are a Windows user:

1. Run compile_ts.cmd
2. Run create_dist.cmd
3. Use the files from the dist directory.

If you are not on Windows, then follow the commands in these files (it's mostly copying around files, changing a particular link in the index.html file and you can leave out the minifying command)

## License

This work is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](http://creativecommons.org/licenses/by-nc/4.0/).
