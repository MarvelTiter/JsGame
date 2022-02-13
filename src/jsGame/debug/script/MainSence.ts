import { BaseSence } from "../../gamebase/BaseSence"
import { Size } from "../../gamebase/data/Size"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { CircleObject } from "../../gamebase/objects/CircleObject"
import { RectObject } from "../../gamebase/objects/RectObject"

export class MainSence extends BaseSence {
    constructor(game: Game) {
        super(game)
        this.setup()
    }
    ball!: CircleObject
    rect: RectObject | undefined
    setup() {
        let r = new RectObject(this.game, this)
        let { w, h } = this.getWindowSize()
        r.pos = new Vector2(w / 2, h / 2)
        r.size = new Size(200, 50)
        this.addElement(r)

        let c = new CircleObject(this.game, this, 50)
        c.pos = new Vector2(400, 200)
        this.addElement(c)
        this.ball = c
    }
    public update(): void {
        super.update()
        if (this.rect === undefined) this.rect = this.findElement<RectObject>("Rect")
        this.ball.getClosestPoints(this.rect)
    }
}
