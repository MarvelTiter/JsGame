import { Vector2 } from "../data/Vector2"
import { MouseArgs } from "../MouseArgs"
import { JoyPosition, JoyType, JoystickBoxRadius } from "./JoystickDefType"

export abstract class JoystickPart {
    pos: Vector2
    touchPos: Vector2 | undefined
    position: JoyPosition
    active: boolean
    joyType: JoyType
    onTouchDown?: () => void
    onTouchUp?: () => void
    constructor(x: number, y: number, position: JoyPosition, type: JoyType) {
        this.pos = new Vector2(x, y)
        this.position = position
        this.active = false
        this.joyType = type
    }
    updateTouchPos(e: MouseArgs | undefined) {
        if (e === undefined) {
            if (this.joyType === "Stick") this.onTouchUp?.call(null)
            this.touchPos = undefined
            this.active = false
        } else {
            if (this.checkFocu(e.x, e.y)) {
                if (this.touchPos === undefined) {
                    if (this.joyType === "Stick") this.onTouchDown?.call(null)
                    this.touchPos = new Vector2(e.x, e.y)
                } else this.touchPos.set(e.x, e.y)
                this.handleTouch()
            }
        }
    }
    checkFocu(x: number, y: number): boolean {
        this.active = Vector2.new(x, y).sub(this.pos).length() < JoystickBoxRadius
        return this.active
    }
    abstract draw(ctx: CanvasRenderingContext2D, offset: Vector2): void
    abstract handleTouch(): void
}
