import { Vector2 } from "../data/Vector2"
import { JoyPosition, JoystickBgColor, JoystickBoxRadius } from "./JoystickDefType"
import { JoystickPart } from "./JoystickPart"

/**
 * 虚拟按键部件
 */
export class JoystickButtons extends JoystickPart {
    onButtonA?: () => void
    onButtonB?: () => void
    onButtonX?: () => void
    onButtonY?: () => void
    constructor(x: number, y: number) {
        super(x, y, "Button")
        this.once = true
    }
    /**
     * 绘制按下按键的扇形区域的起点标记
     * 0 top , 1 right , 2 bottom , 3 left
     */
    private startFlag!: number
    handleTouch(): void {        
        let { x, y } = this.touchPos!.copy().sub(this.pos)
        let angle = Math.atan2(y, x)
        if (-Math.PI / 4 < angle && angle < Math.PI / 4) {
            // 指向右边
            this.startFlag = 1
            this.onButtonB?.call(null)
        } else if ((-Math.PI * 3) / 4 < angle && angle < -Math.PI / 4) {
            // 指向上面
            this.startFlag = 0
            this.onButtonY?.call(null)
        } else if ((-Math.PI * 3) / 4 > angle || angle > (Math.PI * 3) / 4) {
            // 指向左边
            this.startFlag = 3
            this.onButtonX?.call(null)
        } else if ((Math.PI * 3) / 4 > angle && angle > Math.PI / 4) {
            // 指向下面
            this.startFlag = 2
            this.onButtonA?.call(null)
        }
    }
    update(): void {}
    draw(ctx: CanvasRenderingContext2D): void {
        let sencePos = this.pos
        // 摇杆背景圈圈
        ctx.fillStyle = JoystickBgColor
        ctx.beginPath()
        ctx.arc(sencePos.x, sencePos.y, JoystickBoxRadius, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        // 交叉
        {
            // 左上的点
            let lt = Vector2.new(-1, -1).normalize().multi(JoystickBoxRadius).add(sencePos)
            // 右下的点
            let rb = Vector2.new(1, 1).normalize().multi(JoystickBoxRadius).add(sencePos)
            // 右上的点
            let rt = Vector2.new(1, -1).normalize().multi(JoystickBoxRadius).add(sencePos)
            // 左下的点
            let lb = Vector2.new(-1, 1).normalize().multi(JoystickBoxRadius).add(sencePos)
            ctx.strokeStyle = JoystickBgColor
            ctx.beginPath()
            ctx.moveTo(lt.x, lt.y)
            ctx.lineTo(rb.x, rb.y)
            ctx.closePath()
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(rt.x, rt.y)
            ctx.lineTo(lb.x, lb.y)
            ctx.closePath()
            ctx.stroke()
        }
        //画字母
        {
            ctx.font = "bold 48px Arial"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            this.drawButton(ctx, Vector2.new(0, 1), sencePos, "A")
            this.drawButton(ctx, Vector2.new(1, 0), sencePos, "B")
            this.drawButton(ctx, Vector2.new(-1, 0), sencePos, "X")
            this.drawButton(ctx, Vector2.new(0, -1), sencePos, "Y")
        }
        if(!this.active) return
        // 画按下的区域
        {
            if (this.active) {
                if (this.startFlag === 0) {
                    // 上面
                    this.drawPie(ctx, (-Math.PI * 3) / 4, -Math.PI / 4, sencePos)
                } else if (this.startFlag === 1) {
                    // 右边
                    this.drawPie(ctx, (-Math.PI * 1) / 4, Math.PI / 4, sencePos)
                } else if (this.startFlag === 2) {
                    // 下面
                    this.drawPie(ctx, (Math.PI * 1) / 4, (Math.PI * 3) / 4, sencePos)
                } else if (this.startFlag === 3) {
                    // 左边
                    this.drawPie(ctx, (Math.PI * 3) / 4, -(Math.PI * 3) / 4, sencePos)
                }
            }
        }
    }

    private drawButton(ctx: CanvasRenderingContext2D, vec: Vector2, sencePos: Vector2, text: string) {
        let pos = vec.multi(JoystickBoxRadius / 2 + 5).add(sencePos)
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fillText(text, pos.x, pos.y)
        ctx.fill()
    }
    private drawPie(ctx: CanvasRenderingContext2D, startAngle: number, endAngle: number, sencePos: Vector2) {
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(sencePos.x, sencePos.y)
        ctx.arc(sencePos.x, sencePos.y, JoystickBoxRadius, startAngle, endAngle)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
    }
}
