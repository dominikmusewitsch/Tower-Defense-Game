import { Game } from "../../scenes/Game";

export default function handleMap1Init(scene: Game) {
    // Map 1 specific initialization code can go here
    const map = scene.make.tilemap({
        key: "mapOne",
    });
    const tilesetGrass = map.addTilesetImage("GrassTileset", "grass");
    const tilesetWater = map.addTilesetImage("AnimatedWaterTiles", "water");
    const tilesetSolidGreen = map.addTilesetImage("solid_green", "solidGreen");
    if (tilesetGrass) {
        const layerBackground = map.createLayer(
            "Terrain_Background",
            tilesetGrass,
            0,
            0
        );
        const layerPath = map.createLayer("Terrain_Path", tilesetGrass, 0, 0);
        const layerCliffs = map.createLayer(
            "Terrain_Cliffs",
            tilesetGrass,
            0,
            0
        );
        const layerProps = map.createLayer("Props", tilesetGrass, 0, 0);
        const layerDetails = map.createLayer("Details", tilesetGrass, 0, 0);
    }
    if (tilesetWater) {
        const layerWater = map.createLayer("Terrain_Water", tilesetWater, 0, 0);
    }
    //Buildable Layer Init
    if (tilesetSolidGreen) {
        scene.layerBuildable = map.createLayer(
            "Buildable",
            tilesetSolidGreen,
            0,
            0
        );
        scene.layerHighground = map.createLayer(
            "Highground",
            tilesetSolidGreen,
            0,
            0
        );
        scene.layerHighground?.setVisible(false);
        // Disable visibility of buildable layer initially
        scene.layerBuildable && scene.layerBuildable.setVisible(false);

        const layerWaypoints = map.getObjectLayer("Waypoints");
        scene.waypoints = layerWaypoints.objects[0].polyline;
        const startPoint = scene.waypoints[1];

        scene.path = new Phaser.Curves.Path(startPoint.x, startPoint.y);

        scene.waypoints.forEach((point, index) => {
            if (index === 0) return;
            scene.path.lineTo(point.x, point.y);
        });
    }
}

