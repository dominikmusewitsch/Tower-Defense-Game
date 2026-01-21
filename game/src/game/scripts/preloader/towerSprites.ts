import { Preloader } from "../../scenes/Preloader";

export default function loadTowerSprites(preloader: Preloader) {
    //TOWER GENERATION
    preloader.load.spritesheet("tower3", "/towers/Tower03.png", {
        frameWidth: 64,
        frameHeight: 128,
    });
    preloader.load.spritesheet(
        "tower3turret1",
        "/towers/Tower03-Level_01-Turret.png",
        {
            frameWidth: 96,
            frameHeight: 96,
        },
    );
    preloader.load.spritesheet(
        "tower3projectile1",
        "/towers/Tower03-Level_01-Projectile.png",
        {
            frameWidth: 10,
            frameHeight: 10,
        },
    );
    preloader.load.spritesheet(
        "tower3projectile1impact",
        "/towers/Tower03-Level01-Projectile-Impact.png",
        {
            frameWidth: 64,
            frameHeight: 64,
        },
    );
}
