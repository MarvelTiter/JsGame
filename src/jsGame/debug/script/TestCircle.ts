import { BaseSence } from "../../gamebase/BaseSence"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { MouseArgs } from "../../gamebase/MouseArgs"
import { CustomObject } from "../../gamebase/objects/CustomObject"

export class TestCircle extends CustomObject {
    constructor(game: Game, sence: BaseSence, radius: number) {
        super(game, sence)
        this.radius = radius
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
        enableDrag: boolean = false
    onClick(e: MouseArgs): void {
        this.enableDrag = true
    }
    onMouseOver(e: MouseArgs): void {
        if (this.enableDrag) {
            let { x, y } = e
            let clickPoint = new Vector2(x, y)
            let offset = clickPoint.sub(this.pos)
            this.pos.add(offset)
        }
    }
    onMouseUp(): void {
        this.enableDrag = false
    }
}
