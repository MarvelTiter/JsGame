import { RectRigid } from "./RectRigid"
import { RigidBase } from "./RigidComponent"

export class CircleRigid extends RigidBase {
    private _radius: number
    public get radius() {
        return this._radius
    }
    constructor(radius: number, mass?: number) {
        super("Circle", mass)
        this._radius = radius
    }

    getClosestPoint(rigid: RigidBase): void {
        let ball = this
        if (rigid instanceof RectRigid) {
            let rect = rigid
            rect.getClosestPoint(ball)
        }
    }

    update(): void {
        super.update()        
        this._radius = this.target.radius
    }

    drawDebug(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = "#000000"
        ctx.translate(this.pos.x, this.pos.y)
        ctx.beginPath()
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.closePath()
        ctx.translate(-this.pos.x, -this.pos.y)

        if (this.closestPoints.length === 0) return
        // 圆形上最近的点
        for (const p of this.closestPoints) {
            ctx.fillStyle = "#00ff00"
            ctx.beginPath()
            ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI)
            ctx.fill()
        }
    }
}
