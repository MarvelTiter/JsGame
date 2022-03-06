import { clamp } from "../../../../utils/helper"
import { BaseSence } from "../../../gamebase/BaseSence"
import { createBoxRect } from "../../../gamebase/data/Rect"
import { Vector2 } from "../../../gamebase/data/Vector2"
import { GameEntity } from "../../../gamebase/entities/GameEntity"
import { SpriteDefinition } from "../../../gamebase/FrameDefinition"
import { Game } from "../../../gamebase/Game"
import { MouseArgs } from "../../../gamebase/MouseArgs"
import { GameObject } from "../../../gamebase/objects/GameObject"
import { RigidBase } from "../../../gamebase/rigid/RigidBase"
import { Explosion } from "../effects/explosion"

export class Bullet extends GameEntity {
    facing: Vector2
    speed: number
    constructor(game: Game, sence: BaseSence, bulletType: string, x: number, y: number, angle: number, facing: Vector2, speed: number, group: string) {
        super(game, sence, "onlyObjects_retina")
        this.group = group
        this.sprite = this.image.getSprite(bulletType)
        this.rect = createBoxRect(this.sprite.w, this.sprite.h)
        this.pos = Vector2.new(x, y)
        this.facing = facing
        this.speed = speed
        this.addRectRigid(this.rect.w, this.rect.h, {
            angle: angle,
            anglePrev: angle
        })
    }

    onCollide(other: GameObject): void {
        this.explosion()
    }
    explosion() {
        this.sence.removeElement(this)
        let exp = new Explosion(this.game, this.sence, this.pos.x, this.pos.y)
        this.sence.addElement(exp)
    }
    forceRestrain: number = 0.95
    update(delta: number, timeScale: number, correction: number): void {
        this.rigidBody.applyForce(this.facing.copy().multi(this.speed * this.game.options.speedScale))
        this.speed *= this.forceRestrain
        if (this.speed < 0.01) {
            this.explosion()
        }
    }
}
