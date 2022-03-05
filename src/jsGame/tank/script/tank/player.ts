import { clamp } from "../../../../utils/helper"
import { BaseSence } from "../../../gamebase/BaseSence"
import { ITraceable } from "../../../gamebase/Camera"
import { createBoxRect } from "../../../gamebase/data/Rect"
import { Vector2 } from "../../../gamebase/data/Vector2"
import { GameEntity } from "../../../gamebase/entities/GameEntity"
import { SpriteDefinition } from "../../../gamebase/FrameDefinition"
import { Game } from "../../../gamebase/Game"
import { MouseArgs } from "../../../gamebase/MouseArgs"
import { GameObject } from "../../../gamebase/objects/GameObject"
import { RigidBase } from "../../../gamebase/rigid/RigidBase"
import { BulletGreen } from "../bullet/bulletGreen"

export class PlayerTank extends GameEntity implements ITraceable {
    // barrel:GameObject
    constructor(game: Game, sence: BaseSence, x: number, y: number) {
        super(game, sence, "onlyObjects_retina")
        this.group = "player"
        this.sprite = this.image.getSprite("tank_green")
        this.rect = createBoxRect(this.sprite.w, this.sprite.h)
        this.pos = Vector2.new(x, y)
        this.posPrev = Vector2.new(x, y)
        this.addRectRigid(this.rect.w, this.rect.h, {
            angle: Math.PI,
            anglePrev: Math.PI
        })
        this.rigidBody.onRigidUpdated = (v, angle) => {
            this.facing.rotate(angle)
        }
        
    }
    getPosInfo(): { velocity: Vector2; pos: Vector2 } {
        return {
            velocity: this.rigidBody.velocity,
            pos: this.pos
        }
    }

    turnDirection: number = -1
    turnTo: boolean = false
    forwardDirection: number = 1
    forward: boolean = false
    facing: Vector2 = Vector2.new(0, -1)
    move() {
        if (this.turnTo) {
            this.angle = this.angle + this.turnDirection * 1.6 * this.game.options.speedScale
        }
        if (this.forward) {
            let power = this.forwardDirection * 1 * this.game.options.speedScale
            let pv = this.facing.copy().multi(power)
            this.rigidBody.applyForce(pv)
        }
        this.turnTo = false
        this.forward = false
    }
    fireCooldown: number = 0
    calcCooldown: boolean = false
    fire() {
        if (this.fireCooldown === 0) {
            let p = this.pos.copy().add(this.facing.copy().multi(this.rect.h / 2))
            let bullet = new BulletGreen(this.game, this.sence, p.x, p.y, this.angle, this.facing.copy(), 1, "player")
            this.sence.addElement(bullet)
            this.fireCooldown = 2
            this.calcCooldown = true
        }
    }
    update(delta: number, timeScale: number, correction: number): void {
        this.move()
        if (this.calcCooldown && this.fireCooldown > 0) this.fireCooldown--
    }
}
