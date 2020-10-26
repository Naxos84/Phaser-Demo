/*globals window, document,console,Phaser*/
/*jshint esversion:6*/

import { GameScene } from "./game.js";
import { MenuScene } from "./menu.js";
import { TilemapScene } from "./tilemap.js";
import "../lib/phaser.js";

function preload() {
    //            this.load.setBaseURL('https://labs.phaser.io');

    this.load.image("sky", "space3.png");
    this.load.image("logo", "phaser3-logo.png");
    this.load.image("red", "red.png");
}

function create() {
    this.add.image(400, 300, "sky");

    var particles = this.add.particles("red");

    var emitter = particles.createEmitter({
        speed: 100,
        scale: {
            start: 1,
            end: 0
        },
        blendMode: "NORMAL"
    });

    var logo = this.physics.add.image(400, 100, "logo");

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
}

export const gameData = {
    score: 0
};

let myConfig = {
    type: Phaser.AUTO,
    width: 1334,
    height: 750,
    physics: {
        default: "arcade",
    },
    parent: "game",
    scene: [MenuScene, GameScene, TilemapScene]
};

let game = new Phaser.Game(myConfig);
window.focus();
resize();
window.addEventListener("resize", resize, false);

function resize() {
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
