import { Preloader } from "../../../scenes/Preloader";
export default function loadCrystalSprites(preloader: Preloader) {
    preloader.load.spritesheet(
        "crystalbase",
        "/towers/crystal/crystalbase.png",
        {
            frameWidth: 64,
            frameHeight: 192,
        },
    );
    preloader.load.spritesheet(
        "crystal1weapon",
        "/towers/crystal/crystal1weapon.png",
        {
            frameWidth: 48,
            frameHeight: 48,
        },
    );
    preloader.load.spritesheet(
        "crystal1projectile",
        "/towers/crystal/crystal1projectile.png",
        {
            frameWidth: 64,
            frameHeight: 64,
        },
    );
    preloader.load.spritesheet(
        "crystal1impact",
        "/towers/crystal/crystal1impact.png",
        {
            frameWidth: 32,
            frameHeight: 32,
        },
    );
}
