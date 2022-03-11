import { BaseSence } from "./BaseSence"
import { Game } from "./Game"
import { GameEntity } from "./entities/GameEntity"
import { CanvasContext } from "./types/DefineType"

export class Button extends GameEntity {
    text: string
    font: string
    constructor(game: Game, sence: BaseSence, texture: string, text?: string, fontSize?: number) {
        super(game, sence, texture)
        this.text = text || ""
        this.font = `${(fontSize ?? 18).actualPixel()}px serif`
    }
    checkFocu(x: number, y: number): boolean {
        let isfocus = x - this.offset.x > this.pos.x - this.rect.w / 2 && x - this.offset.x < this.pos.x + this.rect.w / 2 && y - this.offset.y > this.pos.y - this.rect.h / 2 && y - this.offset.y < this.pos.y + this.rect.h / 2
        if (isfocus !== this.focus) {
            this.focus = isfocus
        }
        return this.focus
    }
    draw(context: CanvasContext): void {
        let ctx = context.ui
        let x = this.pos.x + this.offset.x
        let y = this.pos.y + this.offset.y
        ctx.translate(x, y)
        ctx.drawImage(this.image.texture, this.rect.x, this.rect.y, this.rect.w, this.rect.h)
        ctx.translate(-x, -y)
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.font = this.font
        ctx.fillText(this.text, x, y)
    }
}
