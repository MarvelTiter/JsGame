import { BaseSence } from "../../gamebase/BaseSence"
import { Game } from "../../gamebase/Game"
import { CustomObject } from "../../gamebase/objects/CustomObject"

export class Background extends CustomObject {
    constructor(game: Game, sence: BaseSence) {
        super(game, sence)
    }
    draw(ctx: CanvasRenderingContext2D): void {
        let { w, h } = this.sence.camera.window
        let { x, y } = this.sence.camera.getPosition()
        ctx.fillStyle = "rgba(0,0,0,0.3)"
        ctx.fillRect(x, y, w, h)
    }
}
