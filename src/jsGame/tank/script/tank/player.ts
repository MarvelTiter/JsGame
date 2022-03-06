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

    createBullet(p: Vector2): Bullet {
        // 素材原因，坦克与子弹相差 180°
        return new Bullet(this.game, this.sence, "bulletGreen3_outline", p.x, p.y, this.angle + Math.PI, this.facing.copy(), 1, this.group)
    }
    onCollide(other: GameObject): void {}
}
