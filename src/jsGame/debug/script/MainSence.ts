import { BaseSence } from "../../gamebase/BaseSence"
import { Size } from "../../gamebase/data/Size"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { GameEntity } from "../../gamebase/entities/GameEntity"
import { AnimaEntity } from "../../gamebase/entities/AnimaEntity"
import { TestCircle } from "./TestCircle"
import { TestRect } from "./TestRect"
import { GameObject } from "../../gamebase/objects/GameObject"
import { CustomObject } from "../../gamebase/objects/CustomObject"
import { TestTriangle } from "./TestTriangle"

export class MainSence extends BaseSence {
    constructor(game: Game) {
        super(game)
        this.setup()
    }
    ball!: GameObject
    ball2!: GameObject
    tri!: GameObject
    tri2!: GameObject
    rect!: GameObject
    rect2!: GameObject
    setup() {
        let t = new TestTriangle(this.game, this, 100, Math.PI / 8)
        t.pos = new Vector2(400, 400)
        t.theta = Math.PI / 6
        this.addElement(t)
        this.tri = t

        let c = new TestCircle(this.game, this, 50)
        c.pos = new Vector2(200, 200)
        this.addElement(c)
        this.ball = c

        let r = new TestRect(this.game, this, new Size(100, 50))
        r.pos = new Vector2(600, 200)
        this.addElement(r)
        this.rect = r

        let r1 = new TestRect(this.game, this, new Size(100, 50))
        r1.pos = new Vector2(630, 290)
        r1.theta = Math.PI / 6
        // this.addElement(r1)
        this.rect2 = r1
    }
    public update(): void {
        super.update()
        this.contacts.splice(0)
        // for (let i = 0; i < this.elements.length - 1; i++) {
        //     for (let j = 1; j < this.elements.length; j++) {
        //         let cs = this.elements[i].checkCollision(this.elements[j])
        //         this.contacts = this.contacts.concat(cs)
        //     }
        // }
        // let c1 = this.ball.checkCollision(this.tri)
        // this.contacts = this.contacts.concat(c1)
        // let c2 = this.ball.checkCollision(this.rect)
        // this.contacts = this.contacts.concat(c2)
        // let c5 = this.ball.checkCollision(this.rect2)
        // this.contacts = this.contacts.concat(c5)
        let c3 = this.tri.checkCollision(this.rect)
        this.contacts = this.contacts.concat(c3)
        // let c4 = this.rect2.checkCollision(this.rect)
        // this.contacts = this.contacts.concat(c4)
    }
}
