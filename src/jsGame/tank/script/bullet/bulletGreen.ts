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

export class BulletGreen extends GameEntity {
    facing: Vector2
    speed: number
    constructor(game: Game, sence: BaseSence, x: number, y: number, angle: number, facing: Vector2, speed: number, group:string) {
        super(game, sence, "onlyObjects_retina")
        this.group = group
        this.sprite = this.image.getSprite("bulletGreen1")
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
        this.sence.removeElement(this)
    }

    update(delta: number, timeScale: number, correction: number): void {
        this.rigidBody.applyForce(this.facing.copy().multi(this.speed * this.game.options.speedScale))
    }
}
