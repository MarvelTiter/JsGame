import { BaseSence } from "../../gamebase/BaseSence"
import { Size } from "../../gamebase/data/Size"
import { Game } from "../../gamebase/Game"
import { TestObject } from "./TestObject"

export class TestTriangle extends TestObject {
    constructor(game: Game, sence: BaseSence, len: number, theta: number) {
        super(game, sence)
        this.size = new Size(len, len)
        this.addTriangleRigid(len, theta)
    }
    checkFocu(x: number, y: number): boolean {
        let isfocus = x > this.pos.x - this.size.w / 2 && x < this.pos.x + this.size.w / 2 && y > this.pos.y - this.size.h / 2 && y < this.pos.y + this.size.h / 2
        if (isfocus !== this.focus) {
            this.focus = isfocus
        }
        return this.focus
    }
}
