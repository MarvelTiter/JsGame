import { randomBetween } from "../../../utils/random"
import { BaseSence } from "../../gamebase/BaseSence"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { GameEntity } from "../../gamebase/entities/GameEntity"

export class Tree extends GameEntity {
    treeCollection!: Map<string, Tree>
    constructor(game: Game, sence: BaseSence, collection: Map<string, Tree>) {
        super(game, sence, "tree")
        this.rect.scale!(0.2)
        this.treeCollection = collection
        let { w, h } = this.sence.camera.window
        this.pos = new Vector2(randomBetween(0, w), randomBetween(h, 3 * h))
        let offsetPos = this.sence.camera.pos.copy()
        this.pos.add(offsetPos)
        this.addRectRigid((8).actualPixel(), (17).actualPixel(), {
            offset: new Vector2(0, (48).actualPixel()),
            isStatic: true
        })
    }

    update(): void {
        if (this.sence.outOfWindow(this) && this.pos.y < this.sence.camera.pos.y) {
            this.treeCollection.delete(this.id)
            this.sence.removeElement(this)
        }
    }
}
