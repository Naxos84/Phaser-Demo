import Map from "../map/map.js";

export class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.player = null;
        this.cursors = null;
        this.leftButton = null;
        this.rightButton = null;
        this.mapName = "demo.json";
    }

    preload() {
        this.load.image("base", "assets/tilesets/roguelike1_16_16.png");
        this.load.image("base-extruded", "assets/tilesets/roguelike1_16_16_extruded.png");
        this.load.spritesheet("characters", "assets/character/characters.png", { frameWidth: 16, frameHeight: 16 });
        this.load.tilemapTiledJSON("map", `assets/map/${this.mapName}`);
        this.load.image("controls_left", "assets/img/controls_left.png");
        this.load.image("controls_right", "assets/img/controls_right.png");
        this.load.image("controls_up", "assets/img/controls_up.png");
    }

    create() {
        const os = this.sys.game.device.os;

        const isMobile = os.android || os.iOs || os.iPad || os.iPhone;

        this.cursors = this.input.keyboard.createCursorKeys();

        const backspace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
        backspace.on(
            "up",
            function () {
                this.scene.switch("MenuScene");
            },
            this
        );

        const { playerSpawn, mapWidthInPixels, mapHeightInPixels, collidableLayers } = this.createMap();
        this.createAnimations();

        if (!playerSpawn) {
            console.error(`Couldn't find 'player_spawn' object in 'Objects' layer of map ${this.mapName}`);
        }

        this.player = this.physics.add
            .sprite(playerSpawn.x, playerSpawn.y, "characters")
            .setDisplaySize(10, 10)
            .refreshBody();
        this.player.anims.play("standLeft");
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(3);
        this.cameras.main.setBounds(0, 0, mapWidthInPixels, mapHeightInPixels);
        this.player.body.collideWorldBounds = true;
        this.player.body.useDamping = true;

        collidableLayers.forEach(function (layer) {
            this.physics.add.collider(this.player, layer);
        }, this);

        if (isMobile) {
            console.log("This game runs on mobile");
            this.input.addPointer(1);
            this.leftButton = this.add
                .image(30, 280, "controls_left")
                .setInteractive()
                .on(
                    "pointerdown",
                    function (pointer, x, y, e) {
                        e.stopPropagation();
                        this.player.body.setVelocityX(-100);
                    },
                    this
                );
            this.leftButton.on(
                "pointerup",
                function (pointer, x, y, e) {
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
                    function (pointer, x, y, e) {
                        e.stopPropagation();
                        this.player.body.setVelocityX(100);
                    },
                    this
                );
            this.rightButton.on(
                "pointerup",
                function (pointer, x, y, e) {
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
                    function (p, x, y, e) {
                        this.jump();
                    },
                    this
                )
                .on("pointerup", function (p, x, y, e) {}, this);
        }
    }

    createAnimations() {
        this.anims.create({
            key: "walkLeft",
            frames: this.anims.generateFrameNumbers("characters", { frames: [18, 19, 20] }),
            frameRate: 8,
            repeat: -1,
        });
        this.anims.create({
            key: "standLeft",
            frames: this.anims.generateFrameNumbers("characters", { frames: [19] }),
            frameRate: 1,
            repeat: -1,
        });

        this.anims.create({
            key: "walkRight",
            frames: this.anims.generateFrameNumbers("characters", { frames: [30, 31, 32] }),
            frameRate: 8,
            repeat: -1,
        });
        this.anims.create({
            key: "standRight",
            frames: this.anims.generateFrameNumbers("characters", { frames: [31] }),
            frameRate: 1,
            repeat: -1,
        });
        this.anims.create({
            key: "walkDown",
            frames: this.anims.generateFrameNumbers("characters", { frames: [6, 7, 8] }),
            frameRate: 8,
            repeat: -1,
        });
        this.anims.create({
            key: "standDown",
            frames: this.anims.generateFrameNumbers("characters", { frames: [7] }),
            frameRate: 1,
            repeat: -1,
        });
        this.anims.create({
            key: "walkUp",
            frames: this.anims.generateFrameNumbers("characters", { frames: [42, 43, 44] }),
            frameRate: 8,
            repeat: -1,
        });
        this.anims.create({
            key: "standUp",
            frames: this.anims.generateFrameNumbers("characters", { frames: [43] }),
            frameRate: 1,
            repeat: -1,
        });

        this.stopAnimation = {
            walkLeft: "standLeft",
            walkRight: "standRight",
            walkUp: "standUp",
            walkDown: "standDown",
        };
    }

    createMap() {
        const map = new Map(this, "map");
        const dimensions = map.getMapDimensionInPixels();

        return {
            playerSpawn: map.getPlayerSpawn(),
            mapWidthInPixels: dimensions.width,
            mapHeightInPixels: dimensions.height,
            collidableLayers: map.getCollidableLayers(),
        };
    }

    update(time, delta) {
        this.updatePlayer(time, delta);
    }

    updatePlayer(time, delta) {
        const speed = 150;

        // Stop any previous movement from the last frame
        this.player.body.setVelocity(0);

        let animationToPlay = this.player.anims.currentAnim.key;
        if (animationToPlay.includes("walk")) {
            animationToPlay = this.stopAnimation[this.player.anims.currentAnim.key];
        }

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-100);
            animationToPlay = "walkLeft";
        }
        if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(100);
            animationToPlay = "walkRight";
        }
        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-100);
            animationToPlay = "walkUp";
        }
        if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(100);
            animationToPlay = "walkDown";
        }
        if (animationToPlay.includes("walk")) {
            this.player.anims.play(animationToPlay, true);
        } else {
            this.player.body.setVelocityX(0);
            this.player.body.setVelocityY(0);
            this.player.anims.chain(animationToPlay, true);
            this.player.anims.stop();
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        this.player.body.velocity.normalize().scale(speed);
    }
}
