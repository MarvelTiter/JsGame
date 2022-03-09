import { BaseSence } from "../../gamebase/BaseSence"
import { GameEntity } from "../../gamebase/entities/GameEntity"
import { Game } from "../../gamebase/Game"
import { CanvasContext } from "../../gamebase/types/DefineType"

export class Background extends GameEntity {
    constructor(game: Game, sence: BaseSence) {
        super(game, sence, "bg")
    }
    draw(context: CanvasContext): void {
        let ctx = context.game
        let { w, h } = this.sence.getWindowSize()
        let { x, y } = this.sence.camera.getPosition()
        ctx.drawImage(this.image.texture, x, y, w, h)
    }
}
