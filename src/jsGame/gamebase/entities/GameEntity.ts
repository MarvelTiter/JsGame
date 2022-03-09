import { BaseSence } from "../BaseSence"
import { Rect } from "../data/Rect"
import { Vector2 } from "../data/Vector2"
import { SpriteDefinition } from "../FrameDefinition"
import { Game } from "../Game"
import { CustomObject } from "../objects/CustomObject"
import { GameImage } from "../Source"
import { CanvasContext } from "../types/DefineType"

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
        this.rect = Rect.createBoxRect(this.sprite.w, this.sprite.h)
    }

    public get center(): Vector2 {
        return this.pos
    }

    draw(context: CanvasContext): void {
        let ctx = context.game
        let pos = this.pos.copy().add(this.offset)
        let sp = this.sprite
        let re = this.rect
        ctx.save()
        ctx.translate(pos.x, pos.y)
        ctx.rotate(this.angle)
        ctx.drawImage(this.image.texture, sp.x, sp.y, sp.w, sp.h, re.x, re.y, re.w, re.h)
        ctx.translate(-pos.x, -pos.y)
        ctx.restore()
    }
}
