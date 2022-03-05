import { BaseSence } from "../../gamebase/BaseSence"
import { Bound } from "../../gamebase/data/Bound"
import { createBoxRect } from "../../gamebase/data/Rect"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { RigidBase } from "../../gamebase/rigid/RigidBase"
import { TestObject } from "./TestObject"

export class TestRect extends TestObject {
    constructor(game: Game, sence: BaseSence, w: number, h: number, x: number, y: number, options?: Partial<RigidBase>) {
        super(game, sence)
        this.rect = createBoxRect(w, h)
        this.pos = new Vector2(x, y)
        this.addRectRigid(w, h, options)
    }
    checkFocu(x: number, y: number): boolean {
        let isfocus = x > this.pos.x - this.rect.w / 2 && x < this.pos.x + this.rect.w / 2 && y > this.pos.y - this.rect.h / 2 && y < this.pos.y + this.rect.h / 2
        if (isfocus !== this.focus) {
            this.focus = isfocus
        }
        return this.focus
    }
}
