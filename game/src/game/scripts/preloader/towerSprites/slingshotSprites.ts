import { Preloader } from "../../../scenes/Preloader";
export default function loadSlingshotSprites(preloader: Preloader) {
    preloader.load.spritesheet(
        "slingshotbase",
        "/towers/slingshot/slingshotbase.png",
        {
            frameWidth: 64,
            frameHeight: 128,
        },
    );
    preloader.load.spritesheet(
        "slingshot1weapon",
        "/towers/slingshot/slingshot1weapon.png",
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

