import { randomBetween } from "../../../utils/random"
import { BaseSence } from "../../gamebase/BaseSence"
import { Size } from "../../gamebase/data/Size"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { GameEntity } from "../../gamebase/GameEntity"

export class Tree extends GameEntity {
    treeCollection!: Map<string, Tree>
    constructor(game: Game, sence: BaseSence, collection: Map<string, Tree>) {
        super(game, sence, "tree")
        this.size.div(0.2)
        this.treeCollection = collection
        let { w, h } = this.sence.camera.window
        let pos = new Vector2(randomBetween(0, w), randomBetween(h / 2, 2 * h))

        let offsetPos = this.sence.camera.pos.copy()

        this.pos = pos.add(offsetPos)
    }
    // updateRequest(): boolean {
    //     return true
    // }

    update(): void {
        const vy = new Vector2(0, -1)
        this.pos = this.pos.add(vy)
        if (this.sence.outOfWindow(this) && this.pos.y < this.sence.camera.pos.y) {
            this.treeCollection.delete(this.id)
            this.sence.removeElement(this)
        }
    }
}
