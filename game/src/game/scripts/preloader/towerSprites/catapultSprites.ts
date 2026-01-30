import { Preloader } from "../../../scenes/Preloader";
export default function loadCatapultSprites(preloader: Preloader) {
    preloader.load.spritesheet(
        "catapultbase",
        "/towers/catapult/catapultbase.png",
        {
            frameWidth: 64,
            frameHeight: 128,
        },
    );
    preloader.load.spritesheet(
        "catapult1weapon",
        "/towers/catapult/catapult1weapon.png",
        {
            frameWidth: 128,
            frameHeight: 128,
        },
    );
    preloader.load.spritesheet(
        "catapult1projectile",
        "/towers/catapult/catapult1projectile.png",
        {
            frameWidth: 8,
            frameHeight: 8,
        },
    );
    preloader.load.spritesheet(
        "catapult1impact",
        "/towers/catapult/catapult1impact.png",
        {
            frameWidth: 64,
            frameHeight: 64,
        },
    );
}

