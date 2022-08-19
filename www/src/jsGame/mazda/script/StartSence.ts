import { BaseSence } from "../../gamebase/BaseSence"
import { DEVICE_MOBILE, Game } from "../../gamebase/Game"
import { Button } from "../../gamebase/Button"
import { Dashboard } from "./Dashboard"
import { Vector2 } from "../../gamebase/data/Vector2"

export class StartSence extends BaseSence {
    constructor(game: Game) {
        super(game)
        this.setup()
    }

    setup() {
        let rpm = new Dashboard(Vector2.new(100, 100), 50, -120, -40, this.game, this)
        this.addElement(rpm)
    }
}
