import { Enemy } from "../enemy.js";

export class Leafbug extends Enemy {
    static animationsCreated = false;
    private currentDirection = "Down";

    override duration = 30000;
    override hp = 150;

    constructor(scene: Phaser.Scene, path: any) {
        super(scene, path, "leafbug");

        // Animationen nur einmal erstellen
        if (!Leafbug.animationsCreated) {
            Leafbug.createAnimations(scene);
            Leafbug.animationsCreated = true;
        }

        // Standard-Animation starten
        this.playMoveAnimation("Down");
    }

    static createAnimations(scene: Phaser.Scene) {
        // Erst das Aseprite JSON aus dem Cache holen
        const tags = scene.anims.createFromAseprite("leafbug");

        // Optional: du könntest hier direkt debug-Log ausgeben
        console.log(
            "Leafbug Animations:",
            tags.map((t) => t.key)
        );
    }

    playMoveAnimation(direction: string) {
        // Der Key wird aus den Aseprite frameTags generiert: "leafbug-Down", "leafbug-Up", etc.
        const key = `leafbug-${direction}`;
        if (this.currentDirection !== direction) {
            this.currentDirection = direction;
            this.play(key);
        }
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        // Kontinuierlich die Bewegungsrichtung aktualisieren und Animation anpassen
        const direction = this.getMovementDirection();
        this.playMoveAnimation(direction);
    }
}

