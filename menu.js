/*globals console,Phaser*/
/*jshint esversion:6*/

export class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
        this.score = 0;
        //        super.key = "MenuScene";
        this.scoreText = null;

    }

    preload() {

        this.load.image('red', 'red.png');
    }

    create() {
        console.log("Create menu scene");

        this.add.image(400, 300, "red");
        this.scoreText = this.add.text(10, 10, this.score);
        this.add.text(100, 10, "Click HERE to start");
        const gameScene = this.scene.get("GameScene");
        gameScene.events.on("addScore", function () {
            console.log("score ", this.score);
            this.score += 1;
            this.scoreText.setText(this.score);
            console.log("score", this.score);
        }, this);
        this.input.on("pointerdown", function () {
            this.input.stopPropagation();
            this.scene.switch("GameScene");
        }, this);
    }

    update(time, delta) {
        this.scoreText.setRotation(this.scoreText.rotation + 0.1);
    }



}
