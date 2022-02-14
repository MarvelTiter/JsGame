import { BaseSence } from "../../gamebase/BaseSence"
import { GameStatisEntity } from "../../gamebase/entities/GameStatisEntity"
import { Game } from "../../gamebase/Game"

export class Background extends GameStatisEntity {
    constructor(game: Game, sence: BaseSence) {
        super(game, sence, "bg")
    }
}
