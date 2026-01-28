import { EnemyType } from "../../../config/enemyConfig";
import { Enemy } from "../enemy";

export class ArrowPath extends Enemy {
    constructor(scene: Phaser.Scene, path: Phaser.Curves.Path) {
        super(scene, path, EnemyType.ArrowPath);
    }
    protected createAnimations() {
        const anims = this.scene.anims;

        // Up
        if (!anims.exists(`${this.ident}-walk-up`)) {
            anims.create({
                key: `${this.ident}-walk-up`,
                frames: anims.generateFrameNumbers(this.ident, {
                    start: 52,
                    end: 55,
                }),
                frameRate: 16,
                repeat: -1,
            });
        }
    }
}

