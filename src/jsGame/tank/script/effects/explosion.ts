import { BaseSence } from "../../../gamebase/BaseSence"
import { AnimaEntity } from "../../../gamebase/entities/AnimaEntity"
import { Game } from "../../../gamebase/Game"

export class Explosion extends AnimaEntity {
    constructor(game: Game, sence: BaseSence, x: number, y: number) {
        super(game, sence, "explosion")
        this.pos.set(x, y)
    }
    update(): void {
        super.update()
        if (this.playTimes === 1) {
            this.sence.removeElement(this)
        }
    }
}
