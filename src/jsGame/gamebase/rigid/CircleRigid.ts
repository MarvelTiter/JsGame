import { AxisInfo } from "../data/AxisInfo"
import { Vector2 } from "../data/Vector2"
import { Contact } from "../collision/Contact"
import { RectRigid } from "./RectRigid"
import { RigidBase } from "./RigidBase"
import { TriangleRigid } from "./TriangleRigid"

export class CircleRigid extends RigidBase {
    private _radius: number
    public get radius() {
        return this._radius
    }
    private _points: Vector2[]
    public get points(): Vector2[] {
        return this._points
    }
    constructor(radius: number, density?: number) {
        super(density)
        this._radius = radius
        let maxSides = 25
        let sides = Math.ceil(Math.max(10, Math.min(maxSides, radius)))
        if (sides % 2 === 1) sides += 1
        let theta = (2 * Math.PI) / sides
        this._points = []
        let offset = theta * 0.5
        for (let i = 0; i < sides; i++) {
            let angle = offset + i * theta
            let xx = Math.cos(angle) * radius
            let yy = Math.sin(angle) * radius
            this._points.push(Vector2.new(Number(xx.toFixed(3)), Number(yy.toFixed(3))))
        }
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
