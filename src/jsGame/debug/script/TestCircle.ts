import { BaseSence } from "../../gamebase/BaseSence"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { TestObject } from "./TestObject"
export class TestCircle extends TestObject {
    constructor(game: Game, sence: BaseSence, x: number, y: number, radius: number) {
        super(game, sence)
        this.pos = new Vector2(x, y)
        this.radius = radius
        this.addCircleRigid(radius)
    }
    checkFocu(x: number, y: number): boolean {
        let clickPoint = new Vector2(x, y)
        let distance = this.pos.copy().sub(clickPoint).length()
        let isfocus = distance <= this.radius
        if (isfocus !== this.focus) {
            this.focus = isfocus
        }
        return this.focus
    }
}
