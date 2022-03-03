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
    i: number = 0
    createNew() {
        let r = new TestRect(
            this.game,
            this,
            new Bound(100, 50),
            new Vector2(this.i * 30 + 100, this.i * 20 + 200)
        )
        this.addElement(r)
        this.i++
    }
    setup() {
        let left = new TestRect(
            this.game,
            this,
            new Bound(20, this.camera.window.h - 20),
            new Vector2(20, this.camera.window.h / 2),
            {
                isStatic: true
            }
        )
        this.addElement(left)

        let top = new TestRect(
            this.game,
            this,
            new Bound(this.camera.window.w - 20, 20),
            new Vector2(this.camera.window.w / 2, 20),
            {
                isStatic: true
            }
        )
        this.addElement(top)

        let right = new TestRect(
            this.game,
            this,
            new Bound(20, this.camera.window.h - 20),
            new Vector2(this.camera.window.w - 20, this.camera.window.h / 2),
            {
                isStatic: true
            }
        )
        this.addElement(right)

        // this.createNew()
        let bottom = new TestRect(
            this.game,
            this,
            new Bound(this.camera.window.w - 20, 20),
            new Vector2(this.camera.window.w / 2, this.camera.window.h - 20),
            {
                isStatic: true
            }
        )
        this.addElement(bottom)
        window.Update.push(() => {
            this.createNew()
        })
    }
}
