import { BaseSence } from "../BaseSence"
import { Size } from "../data/Size"
import { Vector2 } from "../data/Vector2"
import { Game } from "../Game"
import { GameObject } from "../GameObject"
import { MouseArgs } from "../MouseArgs"
import { RectObject } from "./RectObject"

export class CircleObject extends GameObject {
    stokeStyle: string = "#000000"
    radius: number
    constructor(game: Game, sence: BaseSence, radius: number) {
        super(game, sence)
        this.radius = radius
        this.id = "Ball"
    }
    checkFocu(x: number, y: number): boolean {
        let clickPoint = new Vector2(x, y)
        let distance = this.pos.copy().sub(clickPoint).length()
        let isfocus = distance <= this.radius
        if (isfocus !== this.focus) {
            this.focus = isfocus
        }
        return this.focus
    }
    enableDrag: boolean = false
    onClick(e: MouseArgs): void {
        this.enableDrag = true
    }
    onMouseOver(e: MouseArgs): void {
        if (this.enableDrag) {
            let { x, y } = e
            let clickPoint = new Vector2(x, y)
            let offset = clickPoint.sub(this.pos)
            this.pos.add(offset)
        }
    }
    onMouseUp(): void {
        this.enableDrag = false
    }
    getClosestPoints(rect: RectObject): void {
        var ball = this
        var xPos = ball.pos.x - rect.pos.x
        var yPos = ball.pos.y - rect.pos.y
        // 球相对矩形的位置
        var delta = new Vector2()
        delta.set(xPos, yPos)
        // 如果矩形旋转了，就反向旋转向量，得到相当于没有旋转的相对位置
        var rotatedVector = delta.copy().rotate(-rect.theta)
        //  x, y 限制在矩形的宽高中, 得到矩形四个角或者圆心投影到边上的点
        var dClamped = rotatedVector.copy().max(rect.halfExtendMin).min(rect.halfExtendMax)
        // 旋转回来
        var clamped = dClamped.rotate(rect.theta)
        // 矩形中心指向边或角的点
        var clamedP = rect.pos.copy().add(dClamped)

        // 球心指向矩形最近的点
        var d = ball.pos.copy().sub(clamedP)
        var n = d.normalize()
        // 球上最近的点
        var pb = ball.pos.copy().sub(n.multi(ball.radius))

        let ctx: CanvasRenderingContext2D = this.game.context
        ctx.fillStyle = "#ff0000"
        ctx.beginPath()
        // 中心连线
        ctx.moveTo(ball.pos.x, ball.pos.y)
        ctx.lineTo(ball.pos.x - delta.x, ball.pos.y - delta.y)
        ctx.stroke()
        // 矩阵中心到边上的点的连线
        ctx.moveTo(rect.pos.x, rect.pos.y)
        ctx.lineTo(rect.pos.x + clamped.x, rect.pos.y + clamped.y)
        ctx.stroke()
        // 矩形上最近的点
        ctx.fillStyle = "#ff0000"
        ctx.beginPath()
        ctx.arc(clamedP.x, clamedP.y, 5, 0, 2 * Math.PI)
        ctx.fill()
        // 圆心到矩形最近的点的连线
        ctx.strokeStyle = "#0000ff"
        ctx.beginPath()
        ctx.moveTo(ball.pos.x, ball.pos.y)
        ctx.lineTo(ball.pos.x - d.x, ball.pos.y - d.y)
        ctx.stroke()
        // 圆到矩形最近的点
        ctx.fillStyle = "#00ff00"
        ctx.beginPath()
        ctx.arc(pb.x, pb.y, 5, 0, 2 * Math.PI)
        ctx.fill()
    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.stokeStyle
        ctx.translate(this.pos.x, this.pos.y)
        ctx.beginPath()
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.closePath()
        ctx.translate(-this.pos.x, -this.pos.y)
    }
}
