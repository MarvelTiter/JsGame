import { BaseSence } from "../../../gamebase/BaseSence"
import { createBoxRect } from "../../../gamebase/data/Rect"
import { Vector2 } from "../../../gamebase/data/Vector2"
import { GameEntity } from "../../../gamebase/entities/GameEntity"
import { Game } from "../../../gamebase/Game"
import { Bullet } from "../bullet/bullet"

export class TankBarrel extends GameEntity {
    // barrel:GameObject
    constructor(game: Game, sence: BaseSence, x: number, y: number, name: string) {
        super(game, sence, "onlyObjects_retina")
        this.sprite = this.image.getSprite("tankGreen_barrel2_outline")
        this.rect = createBoxRect(this.sprite.w, this.sprite.h)
        this.pos = Vector2.new(x, y)
        this.posPrev = Vector2.new(x, y)
    }

    turnDirection: number = -1
    turnTo: boolean = false
    forwardDirection: number = 1
    forward: boolean = false
    facing: Vector2 = Vector2.new(0, -1)

    fireCooldown: number = 0
    calcCooldown: boolean = false
    fire() {
        if (this.fireCooldown === 0) {
            let p = this.pos.copy().add(this.facing.copy().multi(this.rect.h / 2))
            let bullet = new Bullet(this.game, this.sence, "", p.x, p.y, this.angle, this.facing.copy(), 1, "player")
            this.sence.addElement(bullet)
            this.fireCooldown = 10
            this.calcCooldown = true
        }
    }
}
