import { BaseSence } from "../../gamebase/BaseSence"
import { Game } from "../../gamebase/Game"
import { TestCircle } from "./TestCircle"
import { TestRect } from "./TestRect"

export class MainSence extends BaseSence {
    constructor(game: Game) {
        super(game)
        this.setup()
    }
    i: number = 0
    createNew() {
        let r = new TestRect(this.game, this, 100, 50, this.i * 30 + 100, this.i * 20 + 200)
        this.addElement(r)
        this.i++
    }
    setup() {
        let left = new TestRect(this.game, this, 20, this.camera.window.h - 20, 20, this.camera.window.h / 2, {
            isStatic: true
        })
        this.addElement(left)

        let top = new TestRect(this.game, this, this.camera.window.w - 20, 20, this.camera.window.w / 2, 20, {
            isStatic: true
        })
        this.addElement(top)

        let right = new TestRect(this.game, this, 20, this.camera.window.h - 20, this.camera.window.w - 20, this.camera.window.h / 2, {
            isStatic: true
        })
        this.addElement(right)

        // this.createNew()
        let bottom = new TestRect(this.game, this, this.camera.window.w - 20, 20, this.camera.window.w / 2, this.camera.window.h - 20, {
            isStatic: true
        })
        this.addElement(bottom)
        let circle = new TestCircle(this.game, this, 200, 400, 30)
        this.addElement(circle)
        window.Update.push(() => {
            // this.createNew()
            this.removeElement(circle)
        })

        this.configJoystick([
            {
                type: "Stick",
                x: 100,
                y: this.getWindowSize().h - 150,
                events: {
                    onTop: () => {},
                    onDown: () => {},
                    onLeft: () => {},
                    onRight: () => {}
                }
            },
            {
                type: "Button",
                x: this.getWindowSize().w - 400,
                y: this.getWindowSize().h - 150,
                events: {
                    onButtonA: () => {},
                    onButtonB: () => {},
                    onButtonX: () => {},
                    onButtonY: () => {}
                }
            },
            {
                type: "Stick",
                x: this.getWindowSize().w - 150,
                y: this.getWindowSize().h - 150,
                events: {
                    onTop: () => {},
                    onDown: () => {},
                    onLeft: () => {},
                    onRight: () => {}
                }
            }
        ])
    }
}
