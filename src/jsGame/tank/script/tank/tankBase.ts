import { BaseSence } from "../../../gamebase/BaseSence"
import { createBoxRect } from "../../../gamebase/data/Rect"
import { Vector2 } from "../../../gamebase/data/Vector2"
import { GameEntity } from "../../../gamebase/entities/GameEntity"
import { Game } from "../../../gamebase/Game"
import { GameObject } from "../../../gamebase/objects/GameObject"
import { Bullet } from "../bullet/bullet"

export abstract class TankBase extends GameEntity {
    facing: Vector2
    turnDirection: number = -1
    forwardDirection: number = 1
    constructor(game: Game, sence: BaseSence, defaultTank: string, x: number, y: number, facing: Vector2) {
        super(game, sence, "onlyObjects_retina")
        this.sprite = this.image.getSprite(defaultTank)
        this.rect = createBoxRect(this.sprite.w, this.sprite.h)
        this.pos = Vector2.new(x, y)
        this.posPrev = Vector2.new(x, y)
        this.facing = facing
        this.addRectRigid(this.rect.w, this.rect.h)
        this.rigidBody.onRigidUpdated = (v, angle) => {
            this.facing.rotate(angle)
        }
    }

    move() {
        let power = this.forwardDirection * 1 * this.game.options.speedScale
        let pv = this.facing.copy().multi(power)
        this.rigidBody.applyForce(pv)
    }
    turn() {
        this.rigidBody.applyTorque(this.turnDirection * 1.6 * this.game.options.torqueScale)
    }
    fireCooldown: number = 0
    calcCooldown: boolean = false
    abstract createBullet(p: Vector2): Bullet
    fire() {
        if (this.fireCooldown === 0) {
            let p = this.pos.copy().add(this.facing.copy().multi(this.rect.h / 2))
            let bullet = this.createBullet(p)
            this.sence.addElement(bullet)
            this.fireCooldown = 20
            this.calcCooldown = true
        }
    }
    update(delta: number, timeScale: number, correction: number): void {
        if (this.calcCooldown && this.fireCooldown > 0) this.fireCooldown--
    }
}
