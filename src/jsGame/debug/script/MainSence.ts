import { BaseSence } from "../../gamebase/BaseSence"
import { Size } from "../../gamebase/data/Size"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { GameEntity } from "../../gamebase/entities/GameEntity"
import { AnimaEntity } from "../../gamebase/entities/AnimaEntity"
import { TestCircle } from "./TestCircle"
import { GameObject } from "../../gamebase/objects/GameObject"

export class MainSence extends BaseSence {
    constructor(game: Game) {
        super(game)
        this.setup()
    }
    ball!: GameObject
    other!: GameObject
    setup() {
        // let r = new GameEntity(this.game, this, "enemy")
        // let { w, h } = this.getWindowSize()
        // r.pos = new Vector2(w / 2, h / 2)
        // let horSize = new Size(r.size.w, 50)
        // let verSize = new Size(50, r.size.h)
        // r.addRectRigid(horSize)
        // r.addRectRigid(verSize)
        // this.addElement(r)
        // this.rect = r

        let t = new GameEntity(this.game, this, "mine")
        t.addTriangleRigid(100, Math.PI / 6)
        t.pos = new Vector2(400, 400)
        this.addElement(t)
        this.other = t

        let c = new TestCircle(this.game, this, 50)
        c.addCircleRigid(50)
        c.pos = new Vector2(200, 200)
        this.addElement(c)
        this.ball = c
    }
    public update(): void {
        super.update()
        this.contacts.splice(0)
        let contact = this.ball.checkCollision(this.other)
        this.contacts = this.contacts.concat(contact)        
    }
}
