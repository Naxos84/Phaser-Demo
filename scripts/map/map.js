class Map {
    /**
     *
     * @param {Phaser.Scene} scene A reference to the scene to load assets
     * @param {string} assetKey the key of the loaded map asset
     */
    constructor(scene, assetKey) {
        this.map = scene.make.tilemap({ key: assetKey });
        const tiles = this.map.addTilesetImage("base", "base-extruded", 16, 16, 1, 3);
        this.backgroundLayer = this.map.createStaticLayer("Background", tiles, 0, 0);
        this.treesLayer = this.map.createStaticLayer("Trees", tiles, 0, 0);

        this.backgroundLayer.setCollisionByProperty({ collision: true });
        this.treesLayer.setCollisionByProperty({ collision: true });

        const debugGraphics = scene.add.graphics().setAlpha(0.75);
        const debugRenderOptions = {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(123, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(255, 0, 0, 255), // Color of colliding face edges
        };
        this.backgroundLayer.renderDebug(debugGraphics, debugRenderOptions);
        this.treesLayer.renderDebug(debugGraphics, debugRenderOptions);
        this.treesLayer.setDepth(1);

        this.playerSpawn = this.map.getObjectLayer("Objects").objects.find((obj) => obj.name === "player_spawn");
    }

    getCollidableLayers() {
        return [this.treesLayer, this.backgroundLayer];
    }

    getMapDimensionInPixels() {
        return { width: this.map.widthInPixels, height: this.map.heightInPixels };
    }

    getPlayerSpawn() {
        return this.playerSpawn;
    }
}

export default Map;
