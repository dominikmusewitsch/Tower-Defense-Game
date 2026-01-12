export class Enemy extends Phaser.GameObjects.PathFollower {
    duration = 40000;
    healthBar: Phaser.GameObjects.Graphics;
    maxHp = 100;
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
        this.hp = this.maxHp;
        this.healthBar = this.scene.add.graphics();
        // Starte die passende Animation (z.B. 'leafbug_down')
        if (scene.anims.exists(`${ident}_down`)) {
            this.play(`${ident}_down`);
        }
    }

    // Die Animationen werden jetzt zentral in der Game-Scene erstellt

    start() {
        this.startFollow({ rotateToPath: false, duration: this.duration });
    }

    updateHealthBar() {
        const barWidth = 32;
        const barHeight = 6;
        const hpPercent = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);

        this.healthBar.clear();

        // Background
        this.healthBar.fillStyle(0x000000, 0.8);
        this.healthBar.fillRect(
            this.x - barWidth / 2,
            this.y - 30,
            barWidth,
            barHeight
        );

        // Foreground
        this.healthBar.fillStyle(0xff0000, 1);
        this.healthBar.fillRect(
            this.x - barWidth / 2 + 1,
            this.y - 29,
            (barWidth - 2) * hpPercent,
            barHeight - 2
        );
    }

    takeDamage(amount: number) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.onDeath();
            return;
        }
        this.updateHealthBar();
    }

    onDeath() {
        this.stopFollow();
        // Optional: Hier könntest du eine Death-Animation abspielen, falls vorhanden
        this.setVisible(false);
        this.healthBar.destroy();
        this.destroy();
    }
    
    update() {
        //Calculate direction
        const dx = this.x - this.lastX;
        const dy = this.y - this.lastY;
        let direction = this.lastDirection;

        this.updateHealthBar();

        if (Math.abs(dx) > Math.abs(dy)) {
            direction = "side";
            // flipX NUR wenn nach links (dx < 0)
            this.flipAnimation = dx < 0;
        } else if (Math.abs(dy) > 0) {
            direction = dy > 0 ? "down" : "up";
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

