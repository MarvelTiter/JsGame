import { BaseSence } from "../../gamebase/BaseSence"
import { Game } from "../../gamebase/Game"
import { MouseArgs } from "../../gamebase/MouseArgs"
import { CustomObject } from "../../gamebase/objects/CustomObject"
import { CanvasContext } from "../../gamebase/types/DefineType"

export class Background extends CustomObject {
    constructor(game: Game, sence: BaseSence) {
        super(game, sence)
    }
    draw(context: CanvasContext): void {
        let ctx = context.game
        let { w, h } = this.sence.getWindowSize()
        let { x, y } = this.sence.getWindowPos()
        ctx.fillStyle = "rgba(0,0,0,0.3)"
        ctx.fillRect(x, y, w, h)
    }
}
