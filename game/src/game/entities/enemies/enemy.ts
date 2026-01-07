export abstract class Enemy extends Phaser.GameObjects.PathFollower {
    duration = 40000;
    hp = 100;
    private lastX = 0;
    private lastY = 0;

    constructor(scene: any, path: any, textureKey: string = "enemy") {
        super(scene, path, path.startPoint.x, path.startPoint.y, textureKey);
        scene.add.existing(this);
        this.lastX = this.x;
        this.lastY = this.y;
    }

    start() {
        this.startFollow({ rotateToPath: false, duration: this.duration });
    }

    protected getMovementDirection(): string {
        const dx = this.x - this.lastX;
        const dy = this.y - this.lastY;

        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        // Schaue welche Richtung dominanter ist
        if (absDy > absDx) {
            return dy < 0 ? "up" : "down";
        } else {
            return dx < 0 ? "left" : "right";
        }
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        this.lastX = this.x;
        this.lastY = this.y;
    }
}

