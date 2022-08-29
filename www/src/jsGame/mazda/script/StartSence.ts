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
        let rpm = new Dashboard(Vector2.new(200, 200), 100, this.game, this)
        rpm.ConfigurePanel(p => {
            p.startAngle = (Math.PI / 2 + Math.PI / 4)
            p.endAngle = Math.PI / 4
        })
        this.addElement(rpm)
    }
}
