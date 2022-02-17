import { Size } from "../data/Size"
import { Vector2 } from "../data/Vector2"
import { CircleRigid } from "./CircleRigid"
import { Contact } from "./Contact"
import { RigidBase } from "./RigidComponent"
import { getClosestPoints } from "./Sat"
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
    private _points: Vector2[] | undefined
    public get points(): Vector2[] {
        if (this._points === undefined) {
            let lt = this.halfExtendMin.copy()
            let lb = new Vector2(this.halfExtendMin.x, this.halfExtendMin.y + this.size.h)
            let rt = new Vector2(this.halfExtendMax.x, this.halfExtendMax.y - this.size.h)
            let rb = this.halfExtendMax.copy()
            this._points = [lt, lb, rt, rb]
        }
        return this._points
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

    getClosestPoint(rigid: RigidBase): Contact[] {
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
            return [
                {
                    gA: rect.target,
                    gB: ball.target,
                    mPa: closestPointOnSelf,
                    mPb: closestPointOnOther,
                    normal: n.normalize(),
                    distance: d.length() - ball.radius
                }
            ]
        } else if (rigid instanceof TriangleRigid) {
            let tri = rigid
            let result = getClosestPoints(rect, tri)
            console.log("tri dist", result.distance)

            return [
                {
                    gA: rect.target,
                    gB: tri.target,
                    mPa: result.point1,
                    mPb: result.point2,
                    normal: new Vector2(),
                    distance: result.distance
                }
            ]
        } else if (rigid instanceof RectRigid) {
            let rectB = rigid
            let result = getClosestPoints(rect, rectB)
            console.log("rect dist", result.distance)
            return [
                {
                    gA: rect.target,
                    gB: rectB.target,
                    mPa: result.point1,
                    mPb: result.point2,
                    normal: new Vector2(),
                    distance: result.distance
                }
            ]
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
        ctx.translate(-pos.x, -pos.y)
        ctx.restore()
    }
}
