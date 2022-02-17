import { BaseSence } from "../BaseSence"
import { GameObject } from "./GameObject"
import { Game } from "../Game"
import { Vector2 } from "../data/Vector2"

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

    draw(ctx: CanvasRenderingContext2D) {
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = this.background
        ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)
        if (this.font) ctx.font = this.font
        ctx.fillStyle = this.color
        ctx.fillText(this.text, this.size.w / 2, this.pos.y + this.size.h / 2)
    }
}
