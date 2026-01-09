export class Enemy extends Phaser.GameObjects.PathFollower {
    duration = 40000;
    hp = 100;

    lastDirection = "down";
    lastX: number;
    lastY: number;
    ident = "scorpion";
    flipAnimation = false;

    constructor(scene: Phaser.Scene, path: Phaser.Curves.Path, ident: string) {
        super(scene, path, path.startPoint.x, path.startPoint.y, ident);
        scene.add.existing(this);
        this.lastX = this.x;
        this.lastY = this.y;
        this.ident = ident;
        // Starte die passende Animation (z.B. 'leafbug_down')
        if (scene.anims.exists(`${ident}_down`)) {
            this.play(`${ident}_down`);
        }
    }

    // Die Animationen werden jetzt zentral in der Game-Scene erstellt

    start() {
        this.startFollow({ rotateToPath: false, duration: this.duration });
    }

    update() {
        //Calculate direction
        const dx = this.x - this.lastX;
        const dy = this.y - this.lastY;
        let direction = this.lastDirection;

        if (Math.abs(dx) > Math.abs(dy)) {
            direction = "side";
            // flipX NUR wenn nach links (dx < 0)
            this.flipAnimation = dx < 0;
        } else if (Math.abs(dy) > 0) {
            direction = dy > 0 ? "down" : "up";
        }

        // ON DEATH
        if (this.hp <= 0) {
            this.stopFollow();
            // Optional: Hier könntest du eine Death-Animation abspielen, falls vorhanden
            this.setVisible(false);
            this.destroy();
            return;
        }

        // Change animation if direction changed
        if (direction !== this.lastDirection) {
            const animKey = `${this.ident}_${direction}`;
            if (this.scene.anims.exists(animKey)) {
                this.play(animKey, true);
                this.flipX = this.flipAnimation;
            }
            this.lastDirection = direction;
        }

        this.lastX = this.x;
        this.lastY = this.y;
    }
}

