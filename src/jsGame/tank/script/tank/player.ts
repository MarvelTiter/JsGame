import { BaseSence } from "../../../gamebase/BaseSence"
import { ITraceable } from "../../../gamebase/interfaces/ITraceable"
import { Vector2 } from "../../../gamebase/data/Vector2"
import { Game } from "../../../gamebase/Game"
import { GameObject } from "../../../gamebase/objects/GameObject"
import { Bullet } from "../bullet/bullet"
import { TankBase } from "./tankBase"

export class PlayerTank extends TankBase implements ITraceable {
    // barrel:GameObject
    constructor(game: Game, sence: BaseSence, x: number, y: number) {
        super(game, sence, "tank_green", x, y, Vector2.new(0, 1))
        this.group = "player"
    }
    getPosInfo(): { velocity: Vector2; pos: Vector2 } {
        return {
            velocity: this.rigidBody.velocity,
            pos: this.pos
        }
    }

    moveDirectly(direction: Vector2, scale: number) {
        let angleDif = this.facing.includedAngle(direction)
        this.facing.rotate(angleDif)
        this.rigidBody.setAngle(direction.angle() - Math.PI / 2)
        let power = scale * 1.5 * this.game.options.speedScale
        let pv = this.facing.copy().multi(power)
        this.rigidBody.applyForce(pv)
    }

    createBullet(p: Vector2): Bullet {
        // 素材原因，坦克与子弹相差 180°
        return new Bullet(this.game, this.sence, "bulletGreen3_outline", p.x, p.y, this.angle + Math.PI, this.facing.copy(), 1, this.group)
    }
    onCollide(other: GameObject): void {}
}
