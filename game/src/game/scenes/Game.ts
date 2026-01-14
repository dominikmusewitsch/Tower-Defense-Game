import { Scene } from "phaser";
import { Enemy } from "../entities/enemy";
import { Tower } from "../entities/tower";
import {handleTowerBuild} from "../scripts/events/gameEvents";
import handleMap1Init from "../scripts/maps/map1";
import { GAME_CONFIG } from "../../config/gameConfig";
import { Types } from "phaser";

export class Game extends Scene {
    public enemies!: Phaser.GameObjects.Group;
    public towers!: Phaser.GameObjects.Group;
    public layerHighground!: Phaser.Tilemaps.TilemapLayer;
    private _money: number;
    private _health: number;
    private enemiesToSpawn: number;
    private enemiesSpawned = 0;
    public selectedTower?: Tower;
    public buildingTowerSelected: string | null;
    public buildingTowerSelectedCost: number;
    public buildPreview: Phaser.GameObjects.Image;
    public buildMode: boolean;
    public towerPlacementClick: Phaser.Input.Pointer;
    public layerBuildable: Phaser.Tilemaps.TilemapLayer;
    public waypoints: Types.Math.Vector2Like[];
    public path: Phaser.Curves.Path;
    constructor() {
        super("Game");
    }
    get money() {
        return this._money;
    }
    set money(value: number) {
        this._money = value;
        this.registry.set("money", this._money);
        this.events.emit("money-changed", this._money);
    }

    get health() {
        return this._health;
    }

    set health(value: number) {
        this._health = value;
        this.events.emit("health-changed", this._health);

        if (this._health <= 0) {
            // Stoppe Game und UI, starte GameOver-Screen
            this.scene.stop("UI");
            this.scene.stop("Game");
            this.scene.start("GameOver");
        }
    }

    cleanup() {
        this.events.off("money-changed");
        this.events.off("health-changed");
        this.events.off("tower-selected");
    }

    create() {
        this.events.once("shutdown", () => {
            this.cleanup();
        });
        //Variable Init
        this.money = GAME_CONFIG.startingMoney;
        this.health = GAME_CONFIG.startingHealth;

        this.registry.set("money", this.money);
        this.registry.set("health", this.health);

        this.buildMode = false;

        this.enemiesSpawned = 0;
        this.enemiesToSpawn = 10;

        //Enemy Group und Tower Group init
        this.enemies = this.add.group({
            classType: Enemy,
            runChildUpdate: false,
        });

        this.towers = this.add.group({
            classType: Tower,
            runChildUpdate: false,
        });

        //Map Init
        handleMap1Init(this);

        // Setup click handler for buildable tiles12
        this.input.on(
            "pointerdown",
            (
                pointer: Phaser.Input.Pointer,
                gameObjects: Phaser.GameObjects.GameObject[]
            ) => {
                //1️⃣ Ignore clicks on GameObjects thile not in Build Mode
                if (gameObjects.length > 0 && this.buildMode === false) {
                    return;
                }
                //2️⃣ Build Mode check - build selected Tower

                if (this.buildMode) {
                    handleTowerBuild(this, pointer);
                }

                // 3️⃣ Click on nothing in particular or while in Build Mode - Deselect Tower
                this.selectedTower?.hideRange();
                this.selectedTower = undefined;
                if (buildRangeIndicator) buildRangeIndicator.setVisible(false);
            }
        );

        this.events.on("tower-selected", (towerId: string, cost: number) => {
            if (this.buildingTowerSelected === towerId) {
                //Build Mode AUS
                this.buildingTowerSelected = null;
                this.layerBuildable && this.layerBuildable.setVisible(false);
                this.buildMode = false;
                this.buildPreview?.setVisible(false);
                return;
            }
            //Deselect currently selected tower
            this.selectedTower?.hideRange();
            this.selectedTower = undefined;

            //BUILD MODE AN
            this.buildingTowerSelected = towerId;
            this.layerBuildable?.setVisible(true);
            this.buildingTowerSelectedCost = cost;
            this.buildMode = true;
            this.buildPreview?.destroy();
            this.buildPreview = this.add
                .image(0, 0, towerId)
                .setAlpha(0.5)
                .setDepth(2);
        });

        //Build Preview Event Listener
        let buildRangeIndicator: Phaser.GameObjects.Graphics | null = null;
        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (!this.buildMode || !this.layerBuildable || !this.buildPreview)
                return;

            const tile = this.layerBuildable.getTileAtWorldXY(
                pointer.worldX,
                pointer.worldY
            );

            if (!tile || tile.index === 0) {
                this.buildPreview.setVisible(false);
                if (buildRangeIndicator) buildRangeIndicator.setVisible(false);
                return;
            }

            this.buildPreview.setVisible(true);
            this.buildPreview.setPosition(
                tile.getCenterX(),
                tile.getCenterY() - 32
            );

            // Range-Kreis anzeigen
            if (!buildRangeIndicator) {
                buildRangeIndicator = this.add.graphics();
                buildRangeIndicator.setDepth(10);
            }
            buildRangeIndicator.clear();
            buildRangeIndicator.fillStyle(0x00ff00, 0.25);
            // Default-Range wie im Tower
            let range = 200;
            if (
                this.layerHighground &&
                this.layerHighground.getTileAtWorldXY(
                    tile.getCenterX(),
                    tile.getCenterY() - 32,
                    false
                ) !== null
            ) {
                range = range * 1.5;
            }
            buildRangeIndicator.fillCircle(
                tile.getCenterX(),
                tile.getCenterY() - 32,
                range
            );
            buildRangeIndicator.setVisible(true);
        });

        //Waypoints Init

        //Enemy Spawn Init
        this.time.addEvent({
            delay: 1000,
            repeat: this.enemiesToSpawn - 1,
            callback: () => {
                const enemy = new Enemy(this, this.path, "leafbug");
                enemy.start();
                this.enemies.add(enemy);
                this.enemiesSpawned++;
            },
        });
        this.scene.launch("UI");
    }

    update() {
        (this.enemies.getChildren() as Enemy[]).forEach((enemy: Enemy) => {
            if (!enemy.active) return;

            enemy.update();

            if (!enemy.isAlive && enemy.isWorthMoney) {
                this.money = this.money + enemy.moneyOnDeath;
                enemy.isWorthMoney = false;
            }

            if (enemy.hasReachedEnd() && enemy.isAlive) {
                this.onBaseHealthChanged(enemy.damageToBase);
                enemy.onDeath();
            }
        });

        this.checkWinCondition();

        (this.towers.getChildren() as Tower[]).forEach((tower: Tower) => {
            tower.update(this.time.now, this.game.loop.delta, this.enemies);
        });
        this.checkWinCondition();
    }

    onBaseHealthChanged(damage: number) {
        this.health = this.health - damage;
    }

    checkWinCondition() {
        const allEnemiesSpawned = this.enemiesSpawned >= this.enemiesToSpawn;

        const noEnemiesLeft =
            (this.enemies.getChildren() as Enemy[]).filter(
                (e: Enemy) => e.isAlive
            ).length === 0;

        if (allEnemiesSpawned && noEnemiesLeft) {
            this.scene.stop("UI");
            this.scene.stop("Game");
            this.scene.start("GameWon");
        }
    }
}

