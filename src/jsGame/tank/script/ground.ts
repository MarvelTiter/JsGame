import { BaseSence } from "../../gamebase/BaseSence"
import { GameEntity } from "../../gamebase/entities/GameEntity"
import { Game } from "../../gamebase/Game"
import { CustomObject } from "../../gamebase/objects/CustomObject"

export class Ground extends GameEntity {
    constructor(game: Game, sence: BaseSence) {
        super(game, sence, "tileSand1")
    }
    draw(ctx: CanvasRenderingContext2D): void {
        let pattern = ctx.createPattern(this.image.texture, "repeat")
        let { w, h } = this.sence.getWindowSize()
        let { x, y } = this.sence.getWindowPos()
        ctx.fillStyle = pattern!
        ctx.fillRect(x - 20, y - 20, w + 40, h + 40)
    }
}
