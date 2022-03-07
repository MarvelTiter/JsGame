import { randomBetween } from "../../../../utils/random"
import { BaseSence } from "../../../gamebase/BaseSence"
import { createBoxRect } from "../../../gamebase/data/Rect"
import { Vector2 } from "../../../gamebase/data/Vector2"
import { GameEntity } from "../../../gamebase/entities/GameEntity"
import { Game } from "../../../gamebase/Game"
import { IHp } from "../../../gamebase/interfaces/IHp"
import { GameObject } from "../../../gamebase/objects/GameObject"
import { Bullet } from "../bullet/bullet"
import { Explosion, ExplosionSmoke } from "../effects/explosion"
import { HpBar } from "./HpBar"

export abstract class TankBase extends GameEntity implements IHp {
    facing: Vector2
    turnDirection: number = -1
    forwardDirection: number = 1
    hpBar: HpBar
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
        this.max = 100
        this.remain = 100
        this.barHeight = 10
        this.barWidth = this.sprite.w
        this.hpBar = new HpBar(this)
    }
    //#region Hp
    max: number
    remain: number
    barWidth: number
    barHeight: number
    getPos(): Vector2 {
        return Vector2.new(0, -this.sprite.h / 2 - 10).add(this.pos)
    }
    //#endregion
    moving: boolean = false
    move() {
        if (!this.moving) return
        let power = this.forwardDirection * 1 * this.game.options.speedScale
        let pv = this.facing.copy().multi(power)
        this.rigidBody.applyForce(pv)
    }
    turning: boolean = false
    turn() {
        if (!this.turning) return
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
    explosion() {
        let x = randomBetween(this.rect.x + this.rect.w, this.rect.x)
        let y = randomBetween(this.rect.y + this.rect.h, this.rect.y)
        let smoke = new ExplosionSmoke(this.game, this.sence, x + this.pos.x, y + this.pos.y)
        x = randomBetween(this.rect.x + this.rect.w, this.rect.x)
        y = randomBetween(this.rect.y + this.rect.h, this.rect.y)
        let fire = new Explosion(this.game, this.sence, x + this.pos.x, y + this.pos.y)
        this.sence.addElement(smoke)
        this.sence.addElement(fire)
        this.sence.removeElement(this)
    }
    update(delta: number, timeScale: number, correction: number): void {
        this.move()
        this.turn()
        if (this.calcCooldown && this.fireCooldown > 0) this.fireCooldown--
    }
    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx)
        this.hpBar.draw(ctx)
    }
}
