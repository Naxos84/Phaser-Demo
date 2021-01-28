/*globals document,console,Phaser*/
/*jshint esversion:6*/

import { gameData } from "../app.js";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
        this.score = 0;
        this.scoreText = null;
    }

    init(data) {
        console.log("Initializing Menu with ", data);
    }

    preload() {
        console.log("Preloading Menu");
    }

    create(data) {
        console.log({ data });
        console.log({ gameData });
        console.log("Creating Menu");
        if (!data.restart) {
            this.scoreText = this.add.text(10, 10, this.score);
            this.add.text(300, 10, "Select an entry");
            this.add
                .text(300, 250, "Start game")
                .setInteractive()
                .on(
                    "pointerup",
                    function (p, x, y, e) {
                        e.stopPropagation();
                        this.scene.switch("GameScene");
                    },
                    this
                );
        }
    }

    //    update(time, delta) {
    //        this.scoreText.setRotation(this.scoreText.rotation + 0.1);
    //    }
}
