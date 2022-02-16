import { BaseSence } from "../../gamebase/BaseSence"
import { Size } from "../../gamebase/data/Size"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { TestObject } from "./TestObject"

export class TestRect extends TestObject {
    constructor(game: Game, sence: BaseSence, size: Size) {
        super(game, sence)
        this.size = size
        this.addRectRigid(size)
    }
    checkFocu(x: number, y: number): boolean {
        let isfocus = x > this.pos.x - this.size.w / 2 && x < this.pos.x + this.size.w / 2 && y > this.pos.y - this.size.h / 2 && y < this.pos.y + this.size.h / 2
        if (isfocus !== this.focus) {
            this.focus = isfocus
        }
        return this.focus
    }
}
