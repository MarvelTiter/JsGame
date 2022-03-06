import { BaseSence } from "../../gamebase/BaseSence"
import { GameEntity } from "../../gamebase/entities/GameEntity"
import { GameStatisEntity } from "../../gamebase/entities/GameStatisEntity"
import { Game } from "../../gamebase/Game"

export class Background extends GameEntity {
    constructor(game: Game, sence: BaseSence) {
        super(game, sence, "bg")
    }
    draw(ctx: CanvasRenderingContext2D): void {
        let { w, h } = this.sence.getWindowSize()
        let { x, y } = this.sence.camera.getPosition()
        ctx.drawImage(this.image.texture, x, y, w, h)
    }
}
