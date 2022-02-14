import { threadId } from "worker_threads"
import { Vector2 } from "../data/Vector2"
import { CircleRigid } from "./CircleRigid"
import { Contact } from "./Contact"
import { RigidBase } from "./RigidComponent"

export class TriangleRigid extends RigidBase {
    private _dLength: number
    public get dLength() {
        return this._dLength
    }
    private _dTheta: number
    public get dTheta() {
        return this._dTheta
    }

    private _points: Vector2[] | undefined
    public get points(): Vector2[] {
        if (this._points === undefined) {
            let cos = Math.cos(this.dTheta)
            let sin = Math.sin(this.dTheta)
            let top = new Vector2(0, -this.dLength)
            let bottomLeft = new Vector2(-cos * this.dLength, +sin * this.dLength)
            let bottomRight = new Vector2(+cos * this.dLength, +sin * this.dLength)
            this._points = [top, bottomLeft, bottomRight]
        }
        return this._points
    }

    /**
     * 三角形为等腰三角形，初始状态底边水平
     * @param len 重心到顶点的距离
     * @param theta 底角与重心的连线与底边形成的夹角
     * @param mass 质量
     */
    constructor(len: number, theta: number, mass?: number) {
        super("Triangle", mass)
        this._dLength = len
        this._dTheta = theta
    }

    getClosestPoint(rigid: RigidBase): Contact {
        let tri = this
        if (rigid instanceof CircleRigid) {
            let ball = rigid
            let delta = ball.pos.copy().sub(tri.pos)
            let rotatedVector = delta.rotate(-tri.theta)
            let cloestV = rotatedVector.max(tri.points[0]).min(tri.points[2])
            let fixedClosestV = cloestV.rotate(tri.theta)
            let closestPointOnSelf = tri.pos.copy().add(fixedClosestV)
            let d = ball.pos.copy().sub(closestPointOnSelf)
            let n = d.normalize()
            let closestPointOnOther = ball.pos.copy().sub(n.multi(ball.radius))
            return {
                gA: tri.target,
                gB: ball.target,
                mPa: closestPointOnSelf,
                mPb: closestPointOnOther,
                normal: n,
                distance: d.length() - ball.radius
            }
        }
        throw new Error("unknow RigidType")
    }
    drawDebug(ctx: CanvasRenderingContext2D): void {
        let points = this.points
        ctx.strokeStyle = "#ff0000"
        ctx.beginPath()
        ctx.translate(this.pos.x, this.pos.y)
        ctx.moveTo(points[0].x, points[0].y)
        ctx.lineTo(points[1].x, points[1].y)
        ctx.lineTo(points[2].x, points[2].y)
        ctx.translate(-this.pos.x, -this.pos.y)
        ctx.closePath()
        ctx.stroke()
    }
}
