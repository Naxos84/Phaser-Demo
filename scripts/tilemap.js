/*globals window,console,Phaser*/
/*jshint esversion:6*/

import "../lib/phaser.js";
import { getParameterByName } from "./utils.js";

export class TilemapScene extends Phaser.Scene {
    constructor() {
        super("TilemapScene");
        this.player = null;
        this.cursors = null;
        this.leftButton = null;
        this.rightButton = null;
    }

    jump() {
        this.player.setVelocityY(-250);
    }

    preload() {
        this.load.image("tilesetEngine", "assets/tilesets/engine1_16_16.png");
        this.load.image("tilesetRoguelike", "assets/tilesets/roguelike1_16_16.png");
        this.load.tilemapTiledJSON("map", "assets/map/ow-0-0.json");
        // this.load.image("player", "assets/img/platformChar_idle.png");
        // this.load.image("controls_left", "assets/img/controls_left.png");
        // this.load.image("controls_right", "assets/img/controls_right.png");
        // this.load.image("controls_up", "assets/img/controls_up.png");
    }

    create() {
        const os = this.sys.game.device.os;

        const isMobile = os.android || os.iOs || os.iPad || os.iPhone;

        this.cursors = this.input.keyboard.createCursorKeys();

        const backspace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
        const space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        const left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT, true, true);
        backspace.on(
            "up",
            function() {
                this.scene.switch("MenuScene");
            },
            this
        );
        space.on("down", this.jump.bind(this));

        const map = this.make.tilemap({
            key: "map",
        });
        const tiles = map.addTilesetImage("engine1_16_16", "tilesetEngine");
        const tiles2 = map.addTilesetImage("roguelike1_16_16", "tilesetRoguelike");
        const background = map.createStaticLayer("Grass", tiles2, 0, 0);
        const floor = map.createStaticLayer("Roads", tiles2, 0, 0);
        
        const trees = map.createStaticLayer("Trees", tiles2, 0, 0);
        floor.setCollisionByProperty({ collides: true });

        const debugGraphics = this.add.graphics().setAlpha(0.75);
        if (getParameterByName("debug") === "true") {
            floor.renderDebug(debugGraphics, {
                tileColor: null, // Color of non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(123, 134, 48, 255), // Color of colliding tiles
                faceColor: new Phaser.Display.Color(255, 0, 0, 255), // Color of colliding face edges
            });
        }

        this.player = this.physics.add
            .sprite(10, 10, "player")
            .setDisplaySize(50, 50)
            .refreshBody();
        this.player.body.collideWorldBounds = true;
        this.player.body.useDamping = true;
        this.physics.add.collider(this.player, floor);

        if (isMobile) {
            this.input.addPointer(1);
            this.leftButton = this.add
                .image(30, 280, "controls_left")
                .setInteractive()
                .on(
                    "pointerdown",
                    function(pointer, x, y, e) {
                        e.stopPropagation();
                        this.player.body.setVelocityX(-100);
                    },
                    this
                );
            this.leftButton.on(
                "pointerup",
                function(pointer, x, y, e) {
                    e.stopPropagation();
                    this.player.body.setVelocityX(0);
                },
                this
            );

            this.rightButton = this.add
                .image(80, 280, "controls_right")
                .setInteractive()
                .on(
                    "pointerdown",
                    function(pointer, x, y, e) {
                        e.stopPropagation();
                        this.player.body.setVelocityX(100);
                    },
                    this
                );
            this.rightButton.on(
                "pointerup",
                function(pointer, x, y, e) {
                    e.stopPropagation();
                    this.player.body.setVelocityX(0);
                },
                this
            );

            this.upButton = this.add
                .image(280, 280, "controls_up")
                .setInteractive()
                .on(
                    "pointerdown",
                    function(p, x, y, e) {
                        this.jump();
                    },
                    this
                )
                .on("pointerup", function(p, x, y, e) {}, this);
            
        }
        
        this.add.text(10, 10, isMobile ? "Mobile" : "Not-Mobile");
    }

    update(time, delta) {
        //        const speed = 175;
        //        // Stop any previous movement from the last frame
        //        this.player.body.setVelocity(0);
        //
        //        this.player.body.velocity.x = 0;
        //         Horizontal movement
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-100);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(100);
        } else {
            if (!this.input.pointer1.isDown) {
                this.player.body.setVelocityX(0);
            }
        }
        //        else if (this.input.pointer1.isDown) {
        //            this.jump();
        //            if (this.input.pointer1.downX < this.player.x) {
        //                this.player.body.velocity.x = -100;
        //            } else {
        //                this.player.body.velocity.x = 100;
        //            }
        //        }
        //
        //        // Vertical movement
        //        if (this.cursors.up.isDown) {
        //            this.player.body.setVelocityY(-100);
        //        } else if (this.cursors.down.isDown) {
        //            this.player.body.setVelocityY(100);
        //        }
        //
        //        // Normalize and scale the velocity so that player can't move faster along a diagonal
        //        this.player.body.velocity.normalize().scale(speed);
    }
}
