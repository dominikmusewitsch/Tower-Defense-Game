export class Enemy extends Phaser.GameObjects.PathFollower {
    duration = 40000;
    hp = 100;

    lastDirection = "down";
    lastX: number;
    lastY: number;

    constructor(scene, path) {
        super(scene, path, path.startPoint.x, path.startPoint.y, "scorpion");
        scene.add.existing(this);
        this.lastX = this.x;
        this.lastY = this.y;
        // Startanimation
        if (scene.anims.exists("scorpion-walk-down")) {
            this.play("scorpion-walk-down");
        }
    }

    start() {
        this.startFollow({ rotateToPath: false, duration: this.duration });
    }

    update() {
        const dx = this.x - this.lastX;
        const dy = this.y - this.lastY;
        let direction = this.lastDirection;

        if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? "right" : "left";
        } else if (Math.abs(dy) > 0) {
            direction = dy > 0 ? "down" : "up";
        }

        if (direction !== this.lastDirection) {
            if (
                direction === "down" &&
                this.scene.anims.exists("scorpion-walk-down")
            ) {
                this.play("scorpion-walk-down", true);
                this.flipX = false;
            } else if (
                direction === "up" &&
                this.scene.anims.exists("scorpion-walk-up")
            ) {
                this.play("scorpion-walk-up", true);
                this.flipX = false;
            } else if (
                direction === "left" &&
                this.scene.anims.exists("scorpion-walk-left")
            ) {
                this.play("scorpion-walk-left", true);
                this.flipX = false;
            } else if (
                direction === "right" &&
                this.scene.anims.exists("scorpion-walk-right")
            ) {
                this.play("scorpion-walk-right", true);
                this.flipX = true;
            }
            this.lastDirection = direction;
        }

        this.lastX = this.x;
        this.lastY = this.y;
    }
}

