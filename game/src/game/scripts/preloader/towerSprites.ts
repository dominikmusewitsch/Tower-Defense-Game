import { Preloader } from "../../scenes/Preloader";

export default function loadTowerSprites(preloader: Preloader) {
    //TOWER GENERATION
    preloader.load.spritesheet("slingshot1base", "/towers/slingshot/slingshot1base.png", {
        frameWidth: 64,
        frameHeight: 128,
    });
    preloader.load.spritesheet(
        "slingshot1turret",
        "/towers/slingshot/slingshot1turret.png",
        {
            frameWidth: 96,
            frameHeight: 96,
        },
    );
    preloader.load.spritesheet(
        "slingshot1projectile",
        "/towers/slingshot/slingshot1projectile.png",
        {
            frameWidth: 10,
            frameHeight: 10,
        },
    );
    preloader.load.spritesheet(
        "slingshot1impact",
        "/towers/slingshot/slingshot1impact.png",
        {
            frameWidth: 64,
            frameHeight: 64,
        },
    );
}
