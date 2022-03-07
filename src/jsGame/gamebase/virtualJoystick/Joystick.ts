import { getActualPixel } from "../../../utils/helper"
import { BaseSence } from "../BaseSence"
import { IRect } from "../data/Rect"
import { Vector2 } from "../data/Vector2"
import { Game } from "../Game"
import { MouseArgs } from "../MouseArgs"
import { GameObject } from "../objects/GameObject"

const JoystickOffset = getActualPixel(20)
const JoystickBoxRadius = getActualPixel(80)
const JoystickBgColor = "rgba(0, 0, 0, .16)"
const JoystickColor = "rgba(0, 0, 0, .5)"
const JoystickRadius = getActualPixel(30)
export class Joystick extends GameObject {
    public get center(): Vector2 {
        return this.pos
    }
    window: IRect
    constructor(game: Game, sence: BaseSence) {
        super(game, sence)
        this.window = sence.getWindowSize()
        this.pos.set(JoystickOffset + JoystickBoxRadius, this.window.h - JoystickOffset - JoystickBoxRadius)
    }

    checkFocu(x: number, y: number): boolean {
        return Vector2.new(x, y).sub(this.pos).length() < JoystickBoxRadius
    }

    touchPos: Vector2 | undefined
    onTouchStart(e: MouseArgs): void {
        this.touchPos = Vector2.new(e.x, e.y)
        this.onTouchDown?.call(null)
        this.handleTouch()
    }
    onTouchMove(e: MouseArgs): void {
        this.touchPos!.set(e.x, e.y)
        this.handleTouch()
    }
    onTouchEnd(): void {
        this.onTouchEnd?.call(null)
        this.touchPos = undefined
    }

    onLeft?: () => void
    onTop?: () => void
    onRight?: () => void
    onDown?: () => void
    onTouchDown?: () => void
    onTouchUp?: () => void
    handleTouch() {
        let { x, y } = this.touchPos!.copy().sub(this.pos)
        let angle = Math.atan2(y, x)
        if (-Math.PI / 4 < angle && angle < Math.PI / 4) {
            // 指向右边
            this.onRight?.call(null)
        } else if ((-Math.PI * 3) / 4 < angle && angle < -Math.PI / 4) {
            // 指向上面
            this.onTop?.call(null)
        } else if ((-Math.PI * 3) / 4 > angle || angle > (Math.PI * 3) / 4) {
            // 指向左边
            this.onLeft?.call(null)
        } else if ((Math.PI * 3) / 4 > angle && angle > Math.PI / 4) {
            // 指向下面
            this.onDown?.call(null)
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        let offset = this.sence.getWindowPos()
        let sencePos = this.pos.copy().add(offset)
        // 摇杆背景圈圈
        ctx.fillStyle = JoystickBgColor
        ctx.beginPath()
        ctx.arc(sencePos.x, sencePos.y, JoystickBoxRadius, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        // 摇杆中心的点
        if (this.touchPos !== undefined) {
            let f = this.touchPos.copy().sub(this.pos)
            if (f.length() > JoystickBoxRadius) {
                f.normalize().multi(JoystickBoxRadius)
            }
            let { x, y } = f.add(this.pos).add(offset)
            ctx.fillStyle = JoystickColor
            ctx.beginPath()
            ctx.arc(x, y, JoystickRadius, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()
        }
    }
}
