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

    private _deltaY!: number
    private _points: Vector2[]
    public get points(): Vector2[] {
        return this._points
    }

    private _offset: Vector2
    public get offset(): Vector2 {
        return this._offset
    }

    /**
     * 三角形为等腰三角形，初始状态底边水平
     * @param len 重心到顶点的距离
     * @param theta 顶角的一半
     * @param mass 质量
     */
    constructor(len: number, theta: number, offset?: Vector2, mass?: number) {
        super("Triangle", mass)
        this._dLength = len
        this._dTheta = theta
        this._offset = offset || new Vector2()
        let cos = Math.cos(this.dTheta)
        let sin = Math.sin(this.dTheta)
        let top = new Vector2(0, -this.dLength)
        this._deltaY = (2 * cos * cos - 1) * this.dLength
        let deltaX = 2 * cos * this.dLength * sin
        let bottomLeft = new Vector2(-deltaX, +this._deltaY)
        let bottomRight = new Vector2(+deltaX, +this._deltaY)
        this._points = [top, bottomLeft, bottomRight]
    }

    getAxis(): Vector2[] {
        // let axis1 = this.points[1].copy().sub(this.points[0]).rotate(this.theta)
        // let axis2 = this.points[2].copy().sub(this.points[1]).rotate(this.theta)
        // let axis3 = this.points[0].copy().sub(this.points[2]).rotate(this.theta)
        // return [axis1, axis2, axis3]
        throw new Error("Method not implemented.")
    }


    getClosestPoint(rigid: RigidBase): Contact {
        let tri = this
        if (rigid instanceof CircleRigid) {
            let ball = rigid
            let closestPointOnSelf: Vector2 = new Vector2()
            let closestPointOnOther: Vector2 = new Vector2()
            let n: Vector2 = new Vector2()
            let d: Vector2 = new Vector2()
            let delta = ball.pos.copy().sub(tri.pos)
            let rotatedDelta = delta.rotate(-tri.theta)
            if (rotatedDelta.y < tri._deltaY) {
                if (rotatedDelta.x <= 0) {
                    // 在三角形重心左边
                    let horRotated = rotatedDelta.rotate(Math.PI / 2 - tri.dTheta)
                    let horLeft = tri.points[1].copy().rotate(Math.PI / 2 - tri.dTheta)
                    let horRight = tri.points[0].copy().rotate(Math.PI / 2 - tri.dTheta)
                    let fixed = horRotated.max(horLeft).min(horRight)
                    let fixedClosestV = fixed.rotate(tri.dTheta - Math.PI / 2)
                    fixedClosestV.rotate(tri.theta)
                    closestPointOnSelf = tri.pos.copy().add(fixedClosestV)
                    d = ball.pos.copy().sub(closestPointOnSelf)
                    n = d.copy().normalize()
                    closestPointOnOther = ball.pos.copy().sub(n.multi(ball.radius))
                } else if (rotatedDelta.x > 0) {
                    // 在三角形重心右边
                    let horRotated = rotatedDelta.rotate(tri.dTheta - Math.PI / 2)
                    let horLeft = tri.points[0].copy().rotate(tri.dTheta - Math.PI / 2)
                    let horRight = tri.points[2].copy().rotate(tri.dTheta - Math.PI / 2)
                    let fixed = horRotated.max(horLeft).min(horRight)
                    let fixedClosestV = fixed.rotate(Math.PI / 2 - tri.dTheta)
                    fixedClosestV.rotate(tri.theta)
                    closestPointOnSelf = tri.pos.copy().add(fixedClosestV)
                    d = ball.pos.copy().sub(closestPointOnSelf)
                    n = d.copy().normalize()
                    closestPointOnOther = ball.pos.copy().sub(n.multi(ball.radius))
                }
            } else {
                let horLeft = tri.points[1]
                let horRight = tri.points[2]
                let fixed = rotatedDelta.max(horLeft).min(horRight)
                fixed.rotate(tri.theta)
                closestPointOnSelf = tri.pos.copy().add(fixed)
                d = ball.pos.copy().sub(closestPointOnSelf)
                n = d.copy().normalize()
                closestPointOnOther = ball.pos.copy().sub(n.multi(ball.radius))
            }
            // for (let index = 0; index < 3; index++) {
            //     const p1 = tri.points[index]
            //     const p2 = tri.points[(index + 1) % 3]
            //     let v1 = p2.copy().sub(p1)
            //     let vo = ball.pos.copy().sub(p1)
            //     let dot = v1.dot(vo)
            //     if (dot <= 0) {
            //         closestPointOnSelf = p1
            //     } else if (dot >= v1.length()) {
            //         closestPointOnSelf = p2
            //     } else {
            //         let vn = v1.normalize()
            //         closestPointOnSelf = vn.multi(dot)
            //     }
            //     let d = ball.pos.copy().sub(closestPointOnSelf)
            //     let n = d.normalize()
            //     closestPointOnOther = ball.pos.copy().sub(n.multi(ball.radius))
            // }

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
        ctx.save()
        ctx.strokeStyle = "#ff0000"
        ctx.beginPath()
        ctx.translate(this.pos.x, this.pos.y)
        for (const p of this.points) {
            let point = p.copy().add(this.offset).rotate(this.theta)
            ctx.lineTo(point.x, point.y)
        }
        ctx.translate(-this.pos.x, -this.pos.y)
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
    }
}
