import { AnimaEntity } from "../../gamebase/entities/AnimaEntity"
import { BaseSence } from "../../gamebase/BaseSence"
import { Game } from "../../gamebase/Game"

export class Firework extends AnimaEntity {
    constructor(game: Game, sence: BaseSence, name: string) {
        super(game, sence, name)
        this.pos = this.sence.getCenter()
        this.playTimes = 2
        this.done = () => {
            sence.removeElement(this)
        }
    }
}
