/*globals console,Phaser*/
/*jshint esversion:6*/

import {
    GameScene
} from "./game.js";
import {
    MenuScene
} from "./menu.js";

function preload() {
    //            this.load.setBaseURL('https://labs.phaser.io');

    this.load.image('sky', 'space3.png');
    this.load.image('logo', 'phaser3-logo.png');
    this.load.image('red', 'red.png');
}

function create() {
    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: {
            start: 1,
            end: 0
        },
        blendMode: 'NORMAL'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
}

let myConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 200
            }
        }
    },
    parent: "game",
    scene: [MenuScene, GameScene]
};

let game = new Phaser.Game(myConfig);
