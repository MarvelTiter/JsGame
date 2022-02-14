import { BaseSence } from "../../gamebase/BaseSence"
import { Game } from "../../gamebase/Game"
import { TextObject } from "../../gamebase/objects/TextObject"

export class Head extends TextObject {
    constructor(game: Game, sence: BaseSence) {
        super(game, sence)
        this.size.w = this.sence.getWindowSize().w
        this.size.h = 50
        this.text = "是兄弟就来扫雷！"
        this.font = "36px serif"
    }
}
