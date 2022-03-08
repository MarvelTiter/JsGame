import { BaseSence } from "./BaseSence"
import { Game } from "./Game"
import { GameEntity } from "./entities/GameEntity"

export class Button extends GameEntity {
    text: string
    constructor(game: Game, sence: BaseSence, name: string, text?: string) {
        super(game, sence, name)
        this.text = text || ""
    }
    checkFocu(x: number, y: number): boolean {
        let isfocus =
            x - this.offset.x > this.pos.x - this.rect.w / 2 &&
            x - this.offset.x < this.pos.x + this.rect.w / 2 &&
            y - this.offset.y > this.pos.y - this.rect.h / 2 &&
            y - this.offset.y < this.pos.y + this.rect.h / 2
        if (isfocus !== this.focus) {
            this.focus = isfocus
        }
        return this.focus
    }
    draw(ctx: CanvasRenderingContext2D): void {
        let x = this.pos.x + this.offset.x
        let y = this.pos.y + this.offset.y
        // ctx.fillStyle = "rgba(0,0,0,0.3)";
        // ctx.fillRect(x, y, this.w, this.h);
        ctx.drawImage(this.image.texture, x - this.rect.w / 2, y - this.rect.h / 2, this.rect.w, this.rect.h)
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.font = "18px serif"
        ctx.fillText(this.text, x, y)
    }
}
