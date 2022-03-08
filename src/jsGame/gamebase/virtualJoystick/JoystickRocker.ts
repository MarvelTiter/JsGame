import { Vector2 } from "../data/Vector2"
import { JoystickPart } from "./JoystickPart"
import { JoyPosition, JoystickBgColor, JoystickBoxRadius, JoystickColor, JoystickRadius } from "./JoystickDefType"
import { MouseArgs } from "../MouseArgs"

/**
 * 摇杆部件
 */
export class JoystickRocker extends JoystickPart {
    onLeft?: () => void
    onTop?: () => void
    onRight?: () => void
    onDown?: () => void
    onChange?: (direction: Vector2, scale: number) => void
    constructor(x: number, y: number) {
        super(x, y, "Stick")
    }
    handleTouch(): void {
        let direction = this.touchPos!.copy().sub(this.pos)
        let angle = Math.atan2(direction.y, direction.x)
        this.onChange?.call(null, direction, direction.length() / JoystickBoxRadius)
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
    draw(ctx: CanvasRenderingContext2D, offset: Vector2): void {
        let sencePos = this.pos.copy().add(offset)
        // 摇杆背景圈圈
        ctx.fillStyle = JoystickBgColor
        ctx.beginPath()
        ctx.arc(sencePos.x, sencePos.y, JoystickBoxRadius, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
        if (!this.active) return
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
