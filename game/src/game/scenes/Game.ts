import { EventBus } from "../EventBus";
import { Scene } from "phaser";
export class Game extends Scene {

    constructor() {
        super("Game");
    }

    create() {
        const map = this.make.tilemap({
            key: "mapOne",
        });
        const tilesetGrass = map.addTilesetImage("GrassTileset", "grass");
        const tilesetWater = map.addTilesetImage(
            "AnimatedWaterTileset",
            "water"
        );

        const layerBackground = map.createLayer(
            "Terrain_Background",
            tilesetGrass,
            0,
            0
        );
        const layerPath = map.createLayer("Terrain_Path", tilesetGrass, 0, 0);
        const layerWater = map.createLayer("Terrain_Water", tilesetWater, 0, 0);
        const layerCliffs = map.createLayer(
            "Terrain_Cliffs",
            tilesetGrass,
            0,
            0
        );
        const layerProps = map.createLayer("Props", tilesetGrass, 0, 0);
        const layerDetails = map.createLayer("Details", tilesetGrass, 0, 0);
    }
}

