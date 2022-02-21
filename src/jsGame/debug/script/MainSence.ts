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
import { collides } from "../../gamebase/collision/collides"

export class MainSence extends BaseSence {
    constructor(game: Game) {
        super(game)
        this.setup()
    }
    setup() {
        // let t = new TestTriangle(this.game, this, 50, Math.PI / 8)
        // t.pos = new Vector2(400, 400)
        // // t.theta = Math.PI / 6
        // this.addElement(t)
        // this.tri = t

        // let c = new TestCircle(this.game, this, 50)
        // c.pos = new Vector2(200, 200)
        // this.addElement(c)
        // this.ball = c

        let r = new TestRect(this.game, this, new Size(100, 50))
        r.pos = new Vector2(600, 200)
        r.theta = Math.PI / 6
        this.addElement(r)
        
        let left = new TestRect(this.game, this, new Size(100, this.camera.window.h))
        left.getComponent().setStatis()
        left.pos = new Vector2(-40, this.camera.window.h / 2)
        this.addElement(left)

        let top = new TestRect(this.game, this, new Size(this.camera.window.w, 100))
        top.pos = new Vector2(this.camera.window.w / 2, -40)
        top.getComponent().setStatis()
        this.addElement(top)

        let bottom = new TestRect(this.game, this, new Size(this.camera.window.w, 100))
        bottom.pos = new Vector2(this.camera.window.w / 2, this.camera.window.h + 40)
        bottom.getComponent().setStatis()
        this.addElement(bottom)

        let right = new TestRect(this.game, this, new Size(100, this.camera.window.h))
        right.getComponent().setStatis()
        right.pos = new Vector2(this.camera.window.w + 40, this.camera.window.h / 2)
        this.addElement(right)

        this.registerKeyAction("w", status => {
            r.pos.y -= 1
        })
        this.registerKeyAction("s", status => {
            r.pos.y += 1
        })
        this.registerKeyAction("a", status => {
            r.pos.x -= 1
        })
        this.registerKeyAction("d", status => {
            r.pos.x += 1
        })
    }
}
