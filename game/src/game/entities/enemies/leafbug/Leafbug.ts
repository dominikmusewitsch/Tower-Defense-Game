import { Enemy } from "../enemy";

export class Leafbug extends Enemy {
    constructor(scene: Phaser.Scene, path: Phaser.Curves.Path) {
        super(scene, path, "leafbug"); // key des Spritesheets

        this.createAnimations();
    }

    private createAnimations() {
        const anims = this.scene.anims;

        // Up
        if (!anims.exists("leafbug_up")) {
            anims.create({
                key: "leafbug_up",
                frames: anims.generateFrameNumbers("leafbug", {
                    start: 25,
                    end: 32,
                }),
                frameRate: 8,
                repeat: -1,
            });
        }

        // Down
        if (!anims.exists("leafbug_down")) {
            anims.create({
                key: "leafbug_down",
                frames: anims.generateFrameNumbers("leafbug", {
                    start: 33,
                    end: 40,
                }),
                frameRate: 8,
                repeat: -1,
            });
        }

        // Left
        if (!anims.exists("leafbug_left")) {
            anims.create({
                key: "leafbug_left",
                frames: anims.generateFrameNumbers("leafbug", {
                    start: 41,
                    end: 48,
                }),
                frameRate: 8,
                repeat: -1,
                
            });
        }

        // Right
        if (!anims.exists("leafbug_right")) {
            anims.create({
                key: "leafbug_right",
                frames: anims.generateFrameNumbers("leafbug", {
                    start: 41,
                    end: 48,
                }),
                frameRate: 8,
                repeat: -1,
            });
        }
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        // Animation basierend auf Richtung abspielen
        const direction = this.getMovementDirection(); // "up", "down", "left", "right"
        console.log("Leafbug direction:", direction);
        this.anims.play("leafbug_" + direction, true);
    }
}

