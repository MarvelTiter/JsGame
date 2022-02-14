import { BaseSence } from "../../gamebase/BaseSence"
import { Size } from "../../gamebase/data/Size"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { GameEntity } from "../../gamebase/entities/GameEntity"
import { AnimaObject } from "../../gamebase/entities/AnimaEntity"

export class MainSence extends BaseSence {
    constructor(game: Game) {
        super(game)
        this.setup()
    }
    ball!: GameEntity
    rect!: GameEntity
    setup() {
        let r = new GameEntity(this.game, this, "enemy")
        let { w, h } = this.getWindowSize()
        r.pos = new Vector2(w / 2, h / 2)
        let horSize = new Size(r.size.w, 50)
        let verSize = new Size(50, r.size.h)
        r.addRectRigid(horSize)
        r.addRectRigid(verSize)
        this.addElement(r)
        this.rect = r

        let c = new AnimaObject(this.game, this, "attack_effect")
        c.addCircleRigid(50)
        c.pos = new Vector2(400, 200)
        this.addElement(c)
        this.ball = c
    }
    public update(): void {
        super.update()
        this.ball.checkCollision(this.rect)
    }
}
