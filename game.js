/*globals console,Phaser*/
/*jshint esversion:6*/

export class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        //        super.key = "GameScene";
        this.platforms = null;
        this.logos = [];
    }

    preload() {

        this.load.image('logo', 'phaser3-logo.png');
        this.load.image("ground", "platform.png");
    }

    create() {
        console.log("Create game scene");

        this.add.text(100, 0, "Click the large logo to return to menu screen.");
        this.add.text(100, 15, "Click somewhere else to spawn smaller logos.");
        this.add.text(100, 30, "Click small logo to destroy it.");

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, "ground").setScale(10, 2).refreshBody();
        this.platforms.create(600, 400, 'ground').setScale(5, 1).refreshBody();
        this.platforms.create(50, 250, 'ground').setScale(5, 1).refreshBody();
        this.platforms.create(750, 220, 'ground').setScale(5, 1).refreshBody();

        const logo = this.add.image(400, 300, "logo").setInteractive();
        this.input.on("pointerup", function (pointer) {
            console.log("add");
            const physLogo = this.physics.add.sprite(pointer.x, pointer.y, "logo").setInteractive();
            physLogo.on("pointerup", function (pointer, x, y, event) {
                event.stopPropagation();
                this.destroy();

            }, physLogo);
            physLogo.setDisplaySize(50, 50).refreshBody();
            physLogo.setBounce(0.6);
            physLogo.setCollideWorldBounds(true);



            this.physics.add.collider(physLogo, this.platforms);
            this.logos.push(physLogo);
        }, this);
        logo.on("pointerup", function (pointer, localX, localY, event) {
            console.log("pointer", pointer);
            console.log("gameobject at " + localX + ":" + localY + " with event ", event);
            event.stopPropagation();
            this.scene.switch("MenuScene");
            this.events.emit("addScore");
        }, this);


    }




}
