import { Size } from "../data/Size"
import { Vector2 } from "../data/Vector2"
import { CircleRigid } from "./CircleRigid"
import { RigidBase } from "./RigidComponent"

export class RectRigid extends RigidBase {
    private _size: Size
    public get size() {
        return this._size
    }
    public get halfExtendMin(): Vector2 {
        return new Vector2(-this.size.w / 2, -this.size.h / 2)
    }
    public get halfExtendMax(): Vector2 {
        return new Vector2(this.size.w / 2, this.size.h / 2)
    }
    constructor(size: Size, mass?: number) {
        super("Rect", mass)
        this._size = size
    }
    getClosestPoint(rigid: RigidBase): void {
        let rect = this

        if (rigid instanceof CircleRigid) {
            let ball = rigid
            // 球相对矩形的位置
            let delta = new Vector2(ball.pos.x - rect.pos.x, ball.pos.y - rect.pos.y)
            // 如果矩形旋转了，就反向旋转向量，得到相当于没有旋转的时候的相对位置
            let rotatedVector = delta.rotate(-rect.theta)
            //  x, y 限制在矩形的宽高中, 得到矩形四个角或者圆心投影到边上的点
            let closestV = rotatedVector.max(rect.halfExtendMin).min(rect.halfExtendMax)
            // 旋转回来
            let fixedClosestV = closestV.rotate(rect.theta)
            // 矩形中心指向边或角的点
            let closestPointOnSelf = rect.pos.copy().add(fixedClosestV)
            this.closestPoints.push(closestPointOnSelf)

            // 球心指向矩形最近的点
            let d = ball.pos.copy().sub(closestPointOnSelf)
            let n = d.normalize()
            // 球上最近的点
            let closestPointOnOther = ball.pos.copy().sub(n.multi(ball.radius))
            ball.closestPoints.push(closestPointOnOther)
        }
    }
    drawDebug(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        ctx.strokeStyle = "#000000"
        ctx.translate(this.pos.x, this.pos.y)
        ctx.beginPath()
        ctx.rotate(this.theta)
        ctx.strokeRect(-this.size.w / 2, -this.size.h / 2, this.size.w, this.size.h)
        ctx.closePath()
        ctx.translate(-this.pos.x, -this.pos.y)
        ctx.restore()

        if (this.closestPoints.length === 0) return
        // 矩形上最近的点
        for (const p of this.closestPoints) {
            ctx.fillStyle = "#ff0000"
            ctx.beginPath()
            ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI)
            ctx.fill()
        }
        // 圆心到矩形最近的点的连线
        // ctx.strokeStyle = "#0000ff"
        // ctx.beginPath()
        // ctx.moveTo(ball.pos.x, ball.pos.y)
        // ctx.lineTo(ball.pos.x - d.x, ball.pos.y - d.y)
        // ctx.stroke()
        // 圆到矩形最近的点
    }
}
