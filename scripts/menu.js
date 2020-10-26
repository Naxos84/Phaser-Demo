/*globals document,console,Phaser*/
/*jshint esversion:6*/

import { gameData } from "./app.js";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
        this.score = 0;
        this.scoreText = null;
    }

    preload() {
        this.load.image("red", "assets/img/red.png");
    }

    create(data) {
        console.log({ data });
        console.log({ gameData });
        console.log("Creating Menu");
        if (!data.restart) {
            this.scoreText = this.add.text(10, 10, this.score);
            this.add.text(300, 10, "Select an entry");
            this.add
                .text(300, 200, "Physics Game")
                .setInteractive()
                .on(
                    "pointerup",
                    function (p, x, y, e) {
                        e.stopPropagation();
                        this.scene.switch("GameScene");
                    },
                    this
                );
            this.add
                .text(300, 250, "Tilemap")
                .setInteractive()
                .on(
                    "pointerup",
                    function (p, x, y, e) {
                        e.stopPropagation();
                        this.scene.switch("TilemapScene");
                    },
                    this
                );
            this.gameScene = this.scene.get("GameScene");
            this.gameScene.events.on(
                "addScore",
                function () {
                    this.score += 1;
                    this.scoreText.setText(this.score);
                },
                this
            );
        }
    }

    //    update(time, delta) {
    //        this.scoreText.setRotation(this.scoreText.rotation + 0.1);
    //    }
}
