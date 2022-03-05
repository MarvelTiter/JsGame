import { threadId } from "worker_threads"
import { AxisInfo } from "../data/AxisInfo"
import { Vector2 } from "../data/Vector2"
import { CircleRigid } from "./CircleRigid"
import { Contact } from "../collision/Contact"
import { RectRigid } from "./RectRigid"
import { RigidBase } from "./RigidBase"

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

    private cache: any
    /**
     * 三角形为等腰三角形，初始状态底边水平
     * @param len 重心到顶点的距离
     * @param theta 顶角的一半
     * @param density 密度
     */
    constructor(len: number, theta: number, offset?: Vector2, density?: number) {
        super(density)
        this._dLength = len
        this._dTheta = theta
        this.offset = offset || new Vector2()
        this._points = []
        let cos = Math.cos(this.dTheta)
        let sin = Math.sin(this.dTheta)
        let top = new Vector2(0, -this.dLength)
        this._deltaY = (2 * cos * cos - 1) * this.dLength
        let deltaX = 2 * cos * this.dLength * sin
        let bottomLeft = new Vector2(-deltaX, +this._deltaY)
        let bottomRight = new Vector2(+deltaX, +this._deltaY)
        this._points = [top, bottomRight, bottomLeft]
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
    }
}
