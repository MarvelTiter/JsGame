import { BaseSence } from "../../gamebase/BaseSence"
import { Bound } from "../../gamebase/data/Bound"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { RigidBase } from "../../gamebase/rigid/RigidComponent"
import { TestObject } from "./TestObject"

export class TestRect extends TestObject {
    constructor(
        game: Game,
        sence: BaseSence,
        size: Bound,
        pos: Vector2,
        options?: Partial<RigidBase>
    ) {
        super(game, sence)
        this.size = size
        this.pos = pos
        this.addRectRigid(size, undefined, options)
    }
    checkFocu(x: number, y: number): boolean {
        let isfocus =
            x > this.pos.x - this.size.w / 2 &&
            x < this.pos.x + this.size.w / 2 &&
            y > this.pos.y - this.size.h / 2 &&
            y < this.pos.y + this.size.h / 2
        if (isfocus !== this.focus) {
            this.focus = isfocus
        }
        return this.focus
    }
}
