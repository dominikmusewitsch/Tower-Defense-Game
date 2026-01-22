import { Enemy } from "./enemy";
import { Game as GameScene } from "../scenes/Game";
import { TowerConfig } from "../../config/towerConfig";

export enum TargetPriority {
    First = "first",
    Strongest = "strongest",
}

export abstract class Tower extends Phaser.GameObjects.Container {
    protected config: TowerConfig;
    protected _range: number;
    protected _fireRate: number;
    protected _damage: number;
    protected lastFired = 0;
    protected rangeCircle!: Phaser.GameObjects.Arc;
    protected isPreview: boolean;
    protected targetPriority: TargetPriority = TargetPriority.First;

    // UI Elements
    protected targetPriorityButton!: Phaser.GameObjects.Container;
    protected targetPriorityText!: Phaser.GameObjects.Text;

    constructor(
        scene: GameScene,
        x: number,
        y: number,
        config: TowerConfig,
        isPreview: boolean,
    ) {
        super(scene, x, y);
        this.config = config;
        this._range = config.range;
        this._fireRate = config.fireRate;
        this._damage = config.damage;
        this.isPreview = isPreview;
        console.log(this.config);
        console.log(isPreview);
        if (
            scene.layerHighground.getTileAtWorldXY(
                x,
                y + (this.config.offsetY ?? 32),
                false,
            )
        ) {
            this.range *= config.highgroundRangeMultiplier ?? 1.5;
        }

        // Create targeting priority button (only for non-preview towers)
        if (!isPreview) {
            this.createTargetPriorityButton(scene);
        }
    }

    private createTargetPriorityButton(scene: GameScene) {
        // Container for the button, positioned to the right of the tower
        this.targetPriorityButton = scene.add.container(this.x + 50, this.y);
        this.targetPriorityButton.setDepth(10000);
        this.targetPriorityButton.setVisible(false);

        // Frame background
        const frame = scene.add.graphics();
        frame.lineStyle(2, 0xffffff, 1);
        frame.fillStyle(0x000000, 0.7);
        frame.fillRoundedRect(-40, -14, 80, 28, 6);
        frame.strokeRoundedRect(-40, -14, 80, 28, 6);

        // Text
        this.targetPriorityText = scene.add.text(0, 0, "First", {
            fontSize: "12px",
            color: "#ffffff",
        });
        this.targetPriorityText.setOrigin(0.5, 0.5);

        // Hit area for clicking
        const hitArea = scene.add.rectangle(0, 0, 80, 28, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });
        hitArea.on("pointerdown", () => {
            this.toggleTargetPriority();
        });

        this.targetPriorityButton.add([
            frame,
            this.targetPriorityText,
            hitArea,
        ]);
    }

    private toggleTargetPriority() {
        const newPriority =
            this.targetPriority === TargetPriority.First
                ? TargetPriority.Strongest
                : TargetPriority.First;
        this.setTargetPriority(newPriority);
        this.updateTargetPriorityText();
    }

    private updateTargetPriorityText() {
        if (!this.targetPriorityText) return;
        const label =
            this.targetPriority === TargetPriority.First
                ? "First"
                : "Strongest";
        this.targetPriorityText.setText(label);
    }

    get range() {
        return this._range;
    }

    set range(value: number) {
        this._range = value;
    }

    get fireRate() {
        return this._fireRate;
    }

    get damage() {
        return this._damage;
    }

    showUi() {
        this.rangeCircle.setPosition(
            this.x,
            this.y + (this.config.offsetY ?? 32),
        );
        this.rangeCircle.setVisible(true);

        if (this.targetPriorityButton) {
            this.targetPriorityButton.setVisible(true);
        }
    }

    hideUi() {
        this.rangeCircle.setVisible(false);

        if (this.targetPriorityButton) {
            this.targetPriorityButton.setVisible(false);
        }
    }

    protected updateDepth() {
        // Set depth based on Y position for proper rendering order
        // Higher Y position = higher depth (rendered in front)
        this.depth = Math.floor(this.y) + 100;
    }

    protected canShoot(time: number): boolean {
        return !this.isPreview && time > this.lastFired + this.fireRate;
    }

    protected abstract createAnimations(): void;

    abstract update(
        time: number,
        delta: number,
        enemies: Phaser.GameObjects.Group,
    ): void;

    protected getTargets(
        enemies: Phaser.GameObjects.Group,
        radius?: number,
        position?: Phaser.Types.Math.Vector2Like,
        forTowerShot = true,
    ): Enemy[] {
        const searchRadius = radius ?? this.range;
        return enemies
            .getChildren()
            .filter((gameObject: Phaser.GameObjects.GameObject) => {
                const e = gameObject as Enemy;
                return (
                    Phaser.Math.Distance.Between(
                        position?.x ?? this.x,
                        position?.y ??
                            this.y +
                                (forTowerShot
                                    ? (this.config.offsetY ?? 32)
                                    : 0),
                        e.x,
                        e.y,
                    ) <= searchRadius && e.isAlive
                );
            }) as Enemy[];
    }

    protected getTarget(enemies: Phaser.GameObjects.Group): Enemy | undefined {
        const targets = this.getTargets(enemies).filter((e) => !e.isGoingToDie);
        if (targets.length === 0) return undefined;

        switch (this.targetPriority) {
            case TargetPriority.Strongest:
                // Get the enemy with the highest health
                return targets.reduce((strongest, current) =>
                    current.hp > strongest.hp ? current : strongest,
                );
            case TargetPriority.First:
            default:
                // Get the enemy furthest along the path (highest progress)
                return targets.reduce((first, current) => {
                    return current.pathProgress > first.pathProgress
                        ? current
                        : first;
                });
        }
    }

    setTargetPriority(priority: TargetPriority): void {
        this.targetPriority = priority;
    }

    getTargetPriority(): TargetPriority {
        return this.targetPriority;
    }

    protected abstract shoot(target: Enemy): void;

    protected abstract spawnProjectile(target: Enemy): void;
}

