import Phaser from "phaser";

export class FloatingReward extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number, value: number) {
        super(scene, x, y);
        scene.add.existing(this);

        // Text: +value
        const text = scene.add.text(0, 0, `+${value}`, {
            font: "18px Arial Black",
            color: "#ffd700",
            stroke: "#000",
            strokeThickness: 3,
            fontStyle: "bold",
        });
        text.setOrigin(0.5, 1);

        // Coin sprite (assume key: 'coin')
        const coin = scene.add.sprite(0, 8, "coin");
        coin.setOrigin(0.5, 0);
        coin.play("coin-spin"); // Animation muss existieren

        this.add([text, coin]);
        this.setDepth(2000);

        // Animation: nach oben + fade out
        scene.tweens.add({
            targets: this,
            y: y - 32,
            alpha: 0,
            duration: 900,
            ease: "Cubic.easeOut",
            onComplete: () => this.destroy(),
        });
    }
}

