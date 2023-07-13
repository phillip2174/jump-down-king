import { GameObjects, Physics } from "phaser";
import { GameObjectConstructor } from "../objects/GameObjectConstructor";

export class OutsideColliderView extends GameObjects.GameObject {
    public outsideColliderImage: Physics.Arcade.Image;

    public doInit(): void {
        GameObjectConstructor(this.scene, this);
        this.spawnOutsideCollider();
    }

    public spawnOutsideCollider(): void {
        this.outsideColliderImage = this.scene.physics.add
            .image(0, this.scene.cameras.main.centerY, "sss")
            .setSize(10, this.scene.cameras.main.height)
            .setOrigin(0, 0.5)
            .setImmovable(false)
            .setGravity(0);
        // @ts-ignore
        this.outsideColliderImage.body.allowGravity = false;
    }
}
