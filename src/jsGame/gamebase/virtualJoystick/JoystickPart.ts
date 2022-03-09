import { Vector2 } from "../data/Vector2"
import { MouseArgs } from "../MouseArgs"
import { JoyType, JoystickBoxRadius } from "./JoystickDefType"

export abstract class JoystickPart {
    pos: Vector2
    touchPos: Vector2 | undefined
    active: boolean
    joyType: JoyType
    once: boolean = false
    constructor(x: number, y: number, type: JoyType) {
        this.pos = new Vector2(x, y)
        this.active = false
        this.joyType = type
    }
    updateTouchPos(touches: MouseArgs[]) {
        for (const touch of touches) {
            if (this.checkFocu(touch.x, touch.y)) {
                this.active = true
                if (this.touchPos === undefined) {
                    this.touchPos = new Vector2(touch.x, touch.y)
                    this.handleTouch()
                } else {
                    this.touchPos.set(touch.x, touch.y)
                    if (!this.once) this.handleTouch()
                }
                return
            }
        }
        this.active = false
        this.touchPos = undefined
    }
    checkFocu(x: number, y: number): boolean {
        this.active = Vector2.new(x, y).sub(this.pos).length() < JoystickBoxRadius
        return this.active
    }
    update() {
        if (!this.active) return
        this.handleTouch()
    }
    abstract draw(ctx: CanvasRenderingContext2D): void
    abstract handleTouch(): void
}
