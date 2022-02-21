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
        for (let i = 0; i < 10; i++) {
            let r = new TestRect(this.game, this, new Size(100, 50))
            r.pos = new Vector2(i * 100 + 50, 200)
            r.theta = Math.PI / 6
            this.addElement(r)
        }

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
    }
}
