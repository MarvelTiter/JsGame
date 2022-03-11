import { BaseSence } from "../../gamebase/BaseSence"
import { Rect } from "../../gamebase/data/Rect"
import { GameEntity } from "../../gamebase/entities/GameEntity"
import { Game } from "../../gamebase/Game"
import { CanvasContext } from "../../gamebase/types/DefineType"
type Position = "LEFT" | "TOP" | "RIGHT" | "BOTTOM"
const WallWidth = 56
export class Wall extends GameEntity {
    constructor(game: Game, sence: BaseSence, position: Position) {
        super(game, sence, "barricadeWood")
        if (position === "LEFT") {
            this.rect = Rect.createBoxRect(WallWidth, sence.maxY)
            this.pos.set(WallWidth / 2, sence.maxY / 2)
        } else if (position === "TOP") {
            this.rect = Rect.createBoxRect(sence.maxX - WallWidth * 2, WallWidth)
            this.pos.set(sence.maxX / 2, WallWidth / 2)
        } else if (position === "RIGHT") {
            this.rect = Rect.createBoxRect(WallWidth, sence.maxY)
            this.pos.set(sence.maxX - WallWidth / 2, sence.maxY / 2)
        } else {
            this.rect = Rect.createBoxRect(sence.maxX - WallWidth * 2, WallWidth)
            this.pos.set(sence.maxX / 2, sence.maxY - WallWidth / 2)
        }
        this.addRectRigid(this.rect.w, this.rect.h, {
            isStatic: true
        })
    }
    pattern: CanvasPattern | undefined
    draw(context: CanvasContext): void {
        let ctx = context.game
        if (this.pattern === undefined) this.pattern = ctx.createPattern(this.image.texture, "repeat")!
        ctx.fillStyle = this.pattern
        // 不能用 translate, 否则 pattern 也会 translate
        ctx.fillRect(this.pos.x + this.rect.x, this.pos.y + this.rect.y, this.rect.w, this.rect.h)
        // ctx.translate(-this.pos.x, -this.pos.y)
        // ctx.restore()
    }
}
