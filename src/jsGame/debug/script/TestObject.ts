import { BaseSence } from "../../gamebase/BaseSence"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { MouseArgs } from "../../gamebase/MouseArgs"
import { CustomObject } from "../../gamebase/objects/CustomObject"
export class TestObject extends CustomObject {
    constructor(game: Game, sence: BaseSence) {
        super(game, sence)
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
            console.log(this.pos)
        }
    }
    onMouseUp(): void {
        this.enableDrag = false
    }
}
