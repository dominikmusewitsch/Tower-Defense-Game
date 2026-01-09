import { Scene } from "phaser";
import { Enemy } from "../entities/enemy";
import { Tower } from "../entities/tower";
export class Game extends Scene {
    enemies: Enemy[] = [];
    towers: Tower[] = [];
    constructor() {
        super("Game");
    }
    create() {
        const map = this.make.tilemap({
            key: "mapOne",
        });
        const tilesetGrass = map.addTilesetImage("GrassTileset", "grass");
        const tilesetWater = map.addTilesetImage("AnimatedWaterTiles", "water");

        if (tilesetGrass) {
            const layerBackground = map.createLayer(
                "Terrain_Background",
                tilesetGrass,
                0,
                0
            );
            const layerPath = map.createLayer(
                "Terrain_Path",
                tilesetGrass,
                0,
                0
            );
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
            const layerWater = map.createLayer(
                "Terrain_Water",
                tilesetWater,
                0,
                0
            );
        }

        const layerWaypoints = map.getObjectLayer("Waypoints");
        console.log(layerWaypoints);
        this.waypoints = layerWaypoints.objects[0].polyline;
        const startPoint = this.waypoints[1];

        this.path = new Phaser.Curves.Path(startPoint.x, startPoint.y);

        this.waypoints.forEach((point, index) => {
            if (index === 0) return;
            this.path.lineTo(point.x, point.y);
        });

        const tower = new Tower(this, 200, 300);
        this.towers.push(tower);

        this.time.addEvent({
            delay: 1000,
            repeat: 9,
            callback: () => {
                const enemy = new Enemy(this, this.path, "leafbug");
                enemy.start();
                this.enemies.push(enemy);
            },
        });

        // Leafbug Animationen automatisch aus JSON erstellen
        const leafbugData = this.cache.json.get("leafbug");
        if (leafbugData && leafbugData.frames) {
            // Alle Animation-Präfixe ermitteln (z.B. Down, Up, Side, Right)
            const prefixes = new Set();
            leafbugData.frames.forEach((f) => {
                const match = f.filename.match(/^Leafbug_([A-Za-z]+)_/);
                if (match) prefixes.add(match[1]);
            });
            // Für jeden Präfix eine Animation anlegen
            prefixes.forEach((prefix) => {
                const frames = leafbugData.frames
                    .filter((f) => f.filename.startsWith(`Leafbug_${prefix}_`))
                    .map((f) => ({ key: "leafbug", frame: f.filename }));
                this.anims.create({
                    key: `leafbug_${prefix.toLowerCase()}`,
                    frames,
                    frameRate: 10,
                    repeat: -1,
                });
            });
        }
    }

    update() {
        this.enemies.forEach((enemy) => {
            enemy.update();
            if (enemy.hp <= 0) {
                this.enemies = this.enemies.filter((e) => e !== enemy);
            }
        });
        this.towers.forEach((tower) => {
            tower.update(this.time.now, this.game.loop.delta, this.enemies);
        });
    }
}

