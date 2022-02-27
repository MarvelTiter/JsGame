import { BaseSence } from "../../gamebase/BaseSence"
import { Bound } from "../../gamebase/data/Bound"
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
        for (let i = 0; i < 3; i++) {
            let r = new TestRect(
                this.game,
                this,
                new Bound(100, 50),
                new Vector2(i * 100 + 200, 200),
                Math.PI / 6
            )
            r.pos = new Vector2(i * 100 + 200, 200)
            this.addElement(r)
        }

        let left = new TestRect(
            this.game,
            this,
            new Bound(100, this.camera.window.h),
            new Vector2(-40, this.camera.window.h / 2)
        )
        left.getComponent().setStatis()
        this.addElement(left)

        let top = new TestRect(
            this.game,
            this,
            new Bound(this.camera.window.w, 100),
            new Vector2(this.camera.window.w / 2, -40)
        )
        top.getComponent().setStatis()
        this.addElement(top)

        let right = new TestRect(
            this.game,
            this,
            new Bound(100, this.camera.window.h),
            new Vector2(this.camera.window.w + 40, this.camera.window.h / 2)
        )
        right.getComponent().setStatis()
        this.addElement(right)
        
        let bottom = new TestRect(
            this.game,
            this,
            new Bound(this.camera.window.w, 100),
            new Vector2(this.camera.window.w / 2, this.camera.window.h + 40)
        )
        bottom.getComponent().setStatis()
        this.addElement(bottom)
    }
}
