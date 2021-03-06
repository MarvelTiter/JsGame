import { BaseSence } from "../BaseSence"
import { GameObject } from "./GameObject"
import { Game } from "../Game"
import { Vector2 } from "../data/Vector2"
import { CanvasContext } from "../types/DefineType"

/**
 * 文本对象
 */
export class TextObject extends GameObject {
    public get center(): Vector2 {
        throw new Error("Method not implemented.")
    }
    background: string
    font: string | undefined
    color: string
    text!: string
    constructor(game: Game, sence: BaseSence) {
        super(game, sence)
        this.background = "#FFA500"
        this.color = "black"
    }

    draw(context: CanvasContext) {
        let ctx = context.game
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = this.background
        ctx.fillRect(this.pos.x, this.pos.y, this.rect.w, this.rect.h)
        if (this.font) ctx.font = this.font
        ctx.fillStyle = this.color
        ctx.fillText(this.text, this.rect.w / 2, this.pos.y + this.rect.h / 2)
    }
}
