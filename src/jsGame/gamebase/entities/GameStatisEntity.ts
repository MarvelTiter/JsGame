import { BaseSence } from "../BaseSence"
import { Size } from "../data/Size"
import { Game } from "../Game"
import { CustomObject } from "../objects/CustomObject"
import { GameImage } from "../Source"

export class GameStatisEntity extends CustomObject {
    image: GameImage
    constructor(game: Game, sence: BaseSence, name: string) {
        super(game, sence)
        this.image = game.getTextureByName(name)
        this.size = new Size(this.image.size.w, this.image.size.h)
        this.radius = (this.size.w + this.size.h) / 2
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image.texture, this.pos.x + this.offset.x, this.pos.y + this.offset.y, this.size.w, this.size.h)
    }
}
