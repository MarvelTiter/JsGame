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
import { Bullet } from "../bullet/bullet"
import { TankBase } from "./tankBase"

export class EnemyTank extends TankBase {
    constructor(game: Game, sence: BaseSence, x: number, y: number) {
        super(game, sence, "tank_blue", x, y, Vector2.new(0, 1))
        this.group = "enemy"
    }
    update(delta: number, timeScale: number, correction: number): void {
        if (this.calcCooldown && this.fireCooldown > 0) this.fireCooldown--
    }
    onCollide(other: GameObject): void {
        this.fire()
    }
    createBullet(p: Vector2): Bullet {
        return new Bullet(this.game, this.sence, "bulletBlue3_outline", p.x, p.y, this.angle + Math.PI, this.facing.copy(), 1, this.group)
    }
}
