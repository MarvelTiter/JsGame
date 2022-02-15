import { BaseSence } from "../../gamebase/BaseSence"
import { Size } from "../../gamebase/data/Size"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { GameEntity } from "../../gamebase/entities/GameEntity"
import { AnimaEntity } from "../../gamebase/entities/AnimaEntity"
import { TestCircle } from "./TestCircle"
import { GameObject } from "../../gamebase/objects/GameObject"
import { CustomObject } from "../../gamebase/objects/CustomObject"

export class MainSence extends BaseSence {
    constructor(game: Game) {
        super(game)
        this.setup()
    }
    ball!: GameObject
    other!: GameObject
    other2!: GameObject

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
        t.addTriangleRigid(100, Math.PI / 8)
        t.pos = new Vector2(400, 400)
        this.addElement(t)
        this.other = t

        let c = new TestCircle(this.game, this, 50)
        c.addCircleRigid(50)
        c.pos = new Vector2(200, 200)
        this.addElement(c)
        this.ball = c

        let r = new CustomObject(this.game, this)
        r.size = new Size(100, 50)
        r.addRectRigid(r.size)
        r.pos = new Vector2(600, 200)
        this.addElement(r)
        this.other2 = r
        window.Update = () => {
            this.other.theta += (1 / 30) * Math.PI
            this.other2.theta += (1 / 30) * Math.PI
        }
    }
    public update(): void {
        super.update()
        this.contacts.splice(0)
        let contact1 = this.ball.checkCollision(this.other)
        this.contacts = this.contacts.concat(contact1)
        let contact2 = this.ball.checkCollision(this.other2)
        this.contacts = this.contacts.concat(contact2)
    }
}
