import { BaseSence } from "../../gamebase/BaseSence"
import { GameEntity } from "../../gamebase/entities/GameEntity"
import { Game } from "../../gamebase/Game"
import { CustomObject } from "../../gamebase/objects/CustomObject"

export class Ground extends GameEntity {
    constructor(game: Game, sence: BaseSence) {
        super(game, sence, "allSprites_retina")
        this.sprite = this.image.getSprite("tileSand1")
    }
    draw(ctx: CanvasRenderingContext2D): void {
        let sp = this.sprite
        for (let ii = 0; ii < 10; ii++) {
            for (let jj = 0; jj < 10; jj++) {
                ctx.drawImage(this.image.texture, sp.x, sp.y, sp.w, sp.h, ii * sp.w, jj * sp.h, sp.w, sp.h)
            }
        }
    }
}
