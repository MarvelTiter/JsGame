import { BaseSence } from "../BaseSence"
import { Bound } from "../data/Bound"
import { createBoxRect } from "../data/Rect"
import { Vector2 } from "../data/Vector2"
import { SpriteDefinition } from "../FrameDefinition"
import { Game } from "../Game"
import { CustomObject } from "../objects/CustomObject"
import { GameImage } from "../Source"

/**
 * 有texture的Object
 */
export class GameEntity extends CustomObject {
    image: GameImage
    sprite: SpriteDefinition
    constructor(game: Game, sence: BaseSence, name: string) {
        super(game, sence)
        this.image = game.getTextureByName(name)
        this.sprite = this.image.getSprite()
        this.rect = createBoxRect(this.sprite.w, this.sprite.h)
    }

    public get center(): Vector2 {
        return this.pos
    }

    draw(ctx: CanvasRenderingContext2D): void {
        let pos = this.pos.copy().add(this.offset)
        let sp = this.sprite
        ctx.save()
        ctx.translate(pos.x, pos.y)
        ctx.rotate(this.angle)
        ctx.drawImage(this.image.texture, sp.x, sp.y, sp.w, sp.h, -sp.w / 2, -sp.h / 2, sp.w, sp.h)
        ctx.translate(-pos.x, -pos.y)
        ctx.restore()
    }
}
