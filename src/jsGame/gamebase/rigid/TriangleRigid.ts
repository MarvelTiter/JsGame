import { threadId } from "worker_threads"
import { AxisInfo } from "../data/AxisInfo"
import { Vector2 } from "../data/Vector2"
import { CircleRigid } from "./CircleRigid"
import { Contact } from "../collision/Contact"
import { RectRigid } from "./RectRigid"
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

    private _deltaY!: number
    private _points: Vector2[] | undefined
    public get points(): Vector2[] {
        if (this._points === undefined) {
            let cos = Math.cos(this.dTheta)
            let sin = Math.sin(this.dTheta)
            let top = new Vector2(0, -this.dLength)
            this._deltaY = (2 * cos * cos - 1) * this.dLength
            let deltaX = 2 * cos * this.dLength * sin
            let bottomLeft = new Vector2(-deltaX, +this._deltaY)
            let bottomRight = new Vector2(+deltaX, +this._deltaY)
            this._points = [top, bottomLeft, bottomRight]
        }
        return this._points
    }

    private cache: any
    /**
     * 三角形为等腰三角形，初始状态底边水平
     * @param len 重心到顶点的距离
     * @param theta 顶角的一半
     * @param mass 质量
     */
    constructor(len: number, theta: number, offset?: Vector2, mass?: number) {
        super(mass)
        this._dLength = len
        this._dTheta = theta
        this.offset = offset || new Vector2()
        this.mass = this.calcTriangleArea()
        this.cache = {}
        this.cache["LP1"] = this.points[1].copy().rotate(Math.PI / 2 - this.dTheta)
        this.cache["LP0"] = this.points[0].copy().rotate(Math.PI / 2 - this.dTheta)
        this.cache["RP0"] = this.points[0].copy().rotate(this.dTheta - Math.PI / 2)
        this.cache["RP2"] = this.points[2].copy().rotate(this.dTheta - Math.PI / 2)
    }
    calcTriangleArea(): number {
        let w = this.points[1].x - this.points[2].x
        let h = this.points[0].y - this.points[1].y
        return (Math.abs(w) * Math.abs(h)) / 2
    }

    // getAxis(): AxisInfo[] {
    //     let axis1 = this.actualPoints[1].copy().sub(this.actualPoints[0]).normal().normalize()
    //     let axis2 = this.actualPoints[2].copy().sub(this.actualPoints[1]).normal().normalize()
    //     let axis3 = this.actualPoints[0].copy().sub(this.actualPoints[2]).normal().normalize()
    //     return [
    //         { axis: axis1, points: { start: this.actualPoints[0], end: this.actualPoints[1] } },
    //         { axis: axis2, points: { start: this.actualPoints[1], end: this.actualPoints[2] } },
    //         { axis: axis3, points: { start: this.actualPoints[2], end: this.actualPoints[0] } }
    //     ]
    // }

    getClosestPoint(rigid: RigidBase): Contact[] {
        // let tri = this
        // if (rigid instanceof CircleRigid) {
        //     let ball = rigid
        //     let closestPointOnSelf: Vector2
        //     let closestPointOnOther: Vector2
        //     let n: Vector2
        //     let d: Vector2
        //     let dist: number
        //     let delta = ball.pos.copy().sub(tri.pos)
        //     let rotatedDelta = delta.rotate(-tri.theta)
        //     if (rotatedDelta.y < tri._deltaY) {
        //         if (rotatedDelta.x <= 0) {
        //             // 在三角形重心左边
        //             let horRotated = rotatedDelta.rotate(Math.PI / 2 - tri.dTheta)
        //             let horLeft = tri.cache["LP1"]
        //             let horRight = tri.cache["LP0"]
        //             let fixed = horRotated.max(horLeft).min(horRight)
        //             let fixedClosestV = fixed.rotate(tri.dTheta - Math.PI / 2).rotate(tri.theta)
        //             closestPointOnSelf = tri.pos.copy().add(fixedClosestV)
        //         } else {
        //             // 在三角形重心右边
        //             let horRotated = rotatedDelta.rotate(tri.dTheta - Math.PI / 2)
        //             let horLeft = tri.cache["RP0"]
        //             let horRight = tri.cache["RP2"]
        //             let fixed = horRotated.max(horLeft).min(horRight)
        //             let fixedClosestV = fixed.rotate(Math.PI / 2 - tri.dTheta).rotate(tri.theta)
        //             closestPointOnSelf = tri.pos.copy().add(fixedClosestV)
        //         }
        //     } else {
        //         let horLeft = tri.points[1]
        //         let horRight = tri.points[2]
        //         let fixed = rotatedDelta.max(horLeft).min(horRight)
        //         fixed.rotate(tri.theta)
        //         closestPointOnSelf = tri.pos.copy().add(fixed)
        //     }
        //     d = ball.pos.copy().sub(closestPointOnSelf)
        //     dist = d.length()
        //     n = d.normalize()
        //     closestPointOnOther = ball.pos.copy().sub(n.copy().multi(ball.radius))
        //     return [
        //         {
        //             gA: tri.target,
        //             gB: ball.target,
        //             mPa: closestPointOnSelf,
        //             mPb: closestPointOnOther,
        //             normal: n,
        //             distance: dist - ball.radius
        //         }
        //     ]
        // } else if (rigid instanceof RectRigid) {
        //     return rigid.getClosestPoint(tri)
        // } else if (rigid instanceof TriangleRigid) {
        //     let triB = rigid

        //     throw new Error("not implemented")
        // }
        throw new Error("unknow RigidType")
    }
    drawDebug(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        ctx.strokeStyle = "#ff0000"
        ctx.beginPath()
        ctx.translate(this.pos.x, this.pos.y)
        for (const p of this.points) {
            let point = p.copy().add(this.offset).rotate(this.angle)
            ctx.lineTo(point.x, point.y)
        }
        ctx.translate(-this.pos.x, -this.pos.y)
        ctx.closePath()
        ctx.stroke()
        ctx.restore()

        // 画分离轴
    }
}
