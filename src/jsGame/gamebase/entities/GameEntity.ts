import { BaseSence } from "../BaseSence"
import { Bound } from "../data/Bound"
import { Vector2 } from "../data/Vector2"
import { Game } from "../Game"
import { CustomObject } from "../objects/CustomObject"
import { GameImage } from "../Source"

/**
 * 有texture的Object
 */
export class GameEntity extends CustomObject {
    image: GameImage
    constructor(game: Game, sence: BaseSence, name: string) {
        super(game, sence)
        this.image = game.getTextureByName(name)
        this.size = this.image.size.copy()
        this.radius = (this.size.w + this.size.h) / 2
    }

    public get center(): Vector2 {
        return this.pos
    }

    draw(ctx: CanvasRenderingContext2D): void {
        let pos = this.pos.copy().add(this.offset)
        ctx.save()
        ctx.translate(pos.x, pos.y)
        ctx.rotate(this.theta)
        ctx.drawImage(this.image.texture, -this.size.w / 2, -this.size.h / 2, this.size.w, this.size.h)
        ctx.translate(-pos.x, -pos.y)
        ctx.restore()
    }
}
