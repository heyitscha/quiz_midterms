//**Import of Scenes***//
import MenuScene from '../scripts/scenes/MenuScene.js';
import GameScene from '../scripts/scenes/GameScene.js';

//preload of scenes
let menuScene = new MenuScene();
let gameScene = new GameScene();

//**Game Scene***//
let gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 0x0c1445,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "GameScene",
        width: 750,
        height: 1334
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 1700
            }
        }
    },
    
}
let game = new Phaser.Game(gameConfig); //Uploads the settings of config

//loading scenes
game.scene.add('MenuScene', menuScene);
game.scene.add('GameScene', gameScene);


//**Starting Title Menu***//
game.scene.start('MenuScene');
