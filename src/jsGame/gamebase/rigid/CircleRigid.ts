import { AxisInfo } from "../data/AxisInfo"
import { Vector2 } from "../data/Vector2"
import { Contact } from "../collision/Contact"
import { RectRigid } from "./RectRigid"
import { RigidBase } from "./RigidComponent"
import { TriangleRigid } from "./TriangleRigid"

export class CircleRigid extends RigidBase {
    private _radius: number
    public get radius() {
        return this._radius
    }
    public get points(): Vector2[] {
        throw new Error("Method not implemented.")
    }
    constructor(radius: number, mass?: number) {
        super(mass)
        this._radius = radius
    }

    getClosestPoint(rigid: RigidBase): Contact[] {
        // let ball = this
        // if (rigid instanceof RectRigid) {
        //     return rigid.getClosestPoint(ball)
        // } else if (rigid instanceof TriangleRigid) {
        //     return rigid.getClosestPoint(ball)
        // } else if (rigid instanceof CircleRigid) {
        //     let ballB = rigid
        //     let delata = new Vector2(ballB.pos.x - ball.pos.x, ballB.pos.y - ball.pos.y)
        //     let n: Vector2
        //     if (delata.length()) {
        //         n = delata.normalize()
        //     } else {
        //         n = new Vector2(1, 0)
        //     }
        //     let closestPointOnSelf = new Vector2()
        //     closestPointOnSelf.x = ball.pos.x + n.x * ball.radius
        //     closestPointOnSelf.y = ball.pos.y + n.y * ball.radius

        //     let closestPointOnOther = new Vector2()
        //     closestPointOnOther.x = ballB.pos.x - n.x * ballB.radius
        //     closestPointOnOther.y = ballB.pos.y - n.y * ballB.radius

        //     // getdistance
        //     var dist = delata.length() - (ball.radius + ball.radius)

        //     return [
        //         {
        //             gA: ball.target,
        //             gB: ballB.target,
        //             mPa: closestPointOnSelf,
        //             mPb: closestPointOnOther,
        //             normal: n,
        //             distance: dist
        //         }
        //     ]
        // }
        throw new Error("unknow RigidType")
    }

    calcMass(): void {
        this.mass = this.radius * this.radius * Math.PI
    }

    drawDebug(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = "#ff0000"
        ctx.translate(this.pos.x, this.pos.y)
        ctx.beginPath()
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.closePath()
        ctx.translate(-this.pos.x, -this.pos.y)
        // // 圆形上最近的点
        // for (const p of this.closestPoints) {
        //     ctx.fillStyle = "#00ff00"
        //     ctx.beginPath()
        //     ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI)
        //     ctx.closePath()
        //     ctx.fill()
        // }
    }
}
