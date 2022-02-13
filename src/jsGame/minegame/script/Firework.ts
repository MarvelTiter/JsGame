import { AnimaObject } from "../../gamebase/AnimaObject"
import { BaseSence } from "../../gamebase/BaseSence"
import { Game } from "../../gamebase/Game"

export class Firework extends AnimaObject {
    constructor(game: Game, sence: BaseSence, name: string) {
        super(game, sence, name)
        this.pos = this.sence.getCenter()
    }
    update(): void {
        super.update()
        if (this.playTimes === 2) {
            this.sence.removeElement(this)
        }
    }
}
