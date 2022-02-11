import { BaseSence } from "../../gamebase/BaseSence"
import { Game } from "../../gamebase/Game"
import { TextObject } from "../../gamebase/TextObject"

export class Footer extends TextObject {
    public mineCount: number
    public time: string
    constructor(game: Game, sence: BaseSence) {
        super(game, sence)
        this.mineCount = 0
        this.size.w = this.game.getWidth()
        this.size.h = 50
        this.time = ""
        this.font = "36px serif"
    }
    update() {
        this.pos.y = this.game.getHeight() - 50
        this.text = `雷:${this.mineCount}  计时:${this.time}`
    }
}
