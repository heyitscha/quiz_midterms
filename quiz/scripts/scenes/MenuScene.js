export default class MenuScene extends Phaser.Scene{

    constructor(){
        super('MenuScene'); //sets the initial value of your class
    }

    preload(){
        this.load.image('menuBackground', '../assets/bg1.jpg');
    }

    create() {
        let bg = this.add.sprite(0,0, 'menuBackground');
        bg.setOrigin( 0, 0);;

        let startText = this.add.text ( 240, 660, 'Start', {fontSize: '100px'});
        startText.setInteractive({useHandCursor: true});
        startText.on('pointerdown', ()=> this.startButton());

        
    }

    startButton(){
        console.log("Loading. . .");
        this.scene.start('GameScene');
    }

}