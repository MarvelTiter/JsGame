import { BaseSence } from "../../gamebase/BaseSence"
import { Game } from "../../gamebase/Game"
import { TextObject } from "../../gamebase/objects/TextObject"

export class Footer extends TextObject {
    public mineCount: number
    public time: string
    constructor(game: Game, sence: BaseSence) {
        super(game, sence)
        this.mineCount = 0
        this.rect.w = this.sence.getWindowSize().w
        this.rect.h = (50).actualPixel()
        this.time = ""
        this.font = `${(36).actualPixel()}px serif`
    }
    update() {
        this.pos.y = this.sence.getWindowSize().h - (50).actualPixel()
        this.text = `雷:${this.mineCount}  计时:${this.time}`
    }
}
