import { Size } from "../data/Size"
import { Vector2 } from "../data/Vector2"
import { CircleRigid } from "./CircleRigid"
import { Contact } from "./Contact"
import { RigidBase } from "./RigidComponent"
import { TriangleRigid } from "./TriangleRigid"

export class RectRigid extends RigidBase {
    private _size: Size
    public get size() {
        return this._size
    }
    private _halfMin: Vector2 | undefined
    public get halfExtendMin(): Vector2 {
        if (this._halfMin === undefined) {
            this._halfMin = new Vector2(-this.size.w / 2, -this.size.h / 2).add(this.offset)
        }
        return this._halfMin
    }
    private _halfMax: Vector2 | undefined
    public get halfExtendMax(): Vector2 {
        if (this._halfMax === undefined) {
            this._halfMax = new Vector2(this.size.w / 2, this.size.h / 2).add(this.offset)
        }
        return this._halfMax
    }
    private _offset: Vector2
    public get offset() {
        return this._offset
    }

    public get points(): Vector2[] {
        throw new Error("Method not implemented.")
    }

    constructor(size: Size, offset?: Vector2, mass?: number) {
        super("Rect", mass)
        this._size = size
        this._offset = offset || new Vector2()
        this.pos.add(this.offset)
    }

    getAxis(): Vector2[] {
        let xAxis = new Vector2(1, 0).rotate(this.theta)
        let yAxis = new Vector2(0, 1).rotate(this.theta)
        return [xAxis, yAxis]
    }

    getClosestPoint(rigid: RigidBase): Contact {
        let rect = this
        if (rigid instanceof CircleRigid) {
            let ball = rigid
            // 球相对矩形的位置
            let delta = ball.pos.copy().sub(rect.pos)
            // 如果矩形旋转了，就反向旋转向量，得到相当于没有旋转的时候的相对位置
            let rotatedVector = delta.rotate(-rect.theta)
            //  x, y 限制在矩形的宽高中, 得到矩形四个角或者圆心投影到边上的点
            let closestV = rotatedVector.max(rect.halfExtendMin).min(rect.halfExtendMax)
            // 旋转回来
            let fixedClosestV = closestV.rotate(rect.theta)
            // 矩形中心指向边或角的点
            let closestPointOnSelf = rect.pos.copy().add(fixedClosestV)

            // 球心指向矩形最近的点
            let d = ball.pos.copy().sub(closestPointOnSelf)
            let n = d.normalize()
            // 球上最近的点
            let closestPointOnOther = ball.pos.copy().sub(n.multi(ball.radius))
            return {
                gA: rect.target,
                gB: ball.target,
                mPa: closestPointOnSelf,
                mPb: closestPointOnOther,
                normal: n.normalize(),
                distance: d.length() - ball.radius
            }
        } else if (rigid instanceof TriangleRigid) {
            let tri = rigid
            let delta = tri.pos.copy().sub(rect.pos)
            let rotatedVector = delta.rotate(-rect.theta)
            let closestV = rotatedVector.max(rect.halfExtendMin).min(rect.halfExtendMax)
            let fixedClosestV = closestV.rotate(rect.theta)
            let closestPointOnSelf = rect.pos.copy().add(fixedClosestV)

            return {
                gA: rect.target,
                gB: tri.target,
                mPa: closestPointOnSelf,
                mPb: tri.pos,
                normal: new Vector2(),
                distance: 0
            }
        } else if (rigid instanceof RectRigid) {
            let rectB = rigid
            let deltaB = rectB.pos.copy().sub(rect.pos)
            let delta = rect.pos.copy().sub(rectB.pos)

            let p1 = deltaB.max(rect.halfExtendMin).min(rect.halfExtendMax)
            let p2 = delta.max(rectB.halfExtendMin).min(rectB.halfExtendMax)

            return {
                gA: rect.target,
                gB: rectB.target,
                mPa: rect.pos.copy().add(p1),
                mPb: rectB.pos.copy().add(p2),
                normal: new Vector2(),
                distance: 0
            }
        }
        throw new Error("unknow RigidType")
    }
    drawDebug(ctx: CanvasRenderingContext2D): void {
        let pos = this.pos.copy().add(this.offset)
        ctx.save()
        ctx.strokeStyle = "#ff0000"
        ctx.translate(pos.x, pos.y)
        ctx.beginPath()
        ctx.rotate(this.theta)
        ctx.strokeRect(-this.size.w / 2, -this.size.h / 2, this.size.w, this.size.h)
        ctx.closePath()
        ctx.translate(-this.pos.x, -this.pos.y)
        ctx.restore()

        // if (this.closestPoints.length === 0) return
        // // 矩形上最近的点
        // for (const p of this.closestPoints) {
        //     ctx.fillStyle = "#00ff00"
        //     ctx.beginPath()
        //     ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI)
        //     ctx.beginPath()
        //     ctx.fill()
        // }
        // 圆心到矩形最近的点的连线
        // ctx.strokeStyle = "#0000ff"
        // ctx.beginPath()
        // ctx.moveTo(ball.pos.x, ball.pos.y)
        // ctx.lineTo(ball.pos.x - d.x, ball.pos.y - d.y)
        // ctx.stroke()
        // 圆到矩形最近的点
    }
}
