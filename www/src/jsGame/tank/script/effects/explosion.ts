import { BaseSence } from "../../../gamebase/BaseSence"
import { AnimaEntity } from "../../../gamebase/entities/AnimaEntity"
import { Game } from "../../../gamebase/Game"

export class Explosion extends AnimaEntity {
    constructor(game: Game, sence: BaseSence, x: number, y: number) {
        super(game, sence, "explosion", 1)
        this.pos.set(x, y)
        this.done = () => {
            this.sence.removeElement(this)
        }
    }
}

export class ExplosionSmoke extends AnimaEntity {
    constructor(game: Game, sence: BaseSence, x: number, y: number) {
        super(game, sence, "explosionSmoke", 1)
        this.pos.set(x, y)
        this.done = () => {
            this.sence.removeElement(this)
        }
    }
}
