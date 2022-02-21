import { AxisInfo } from "../data/AxisInfo"
import { Size } from "../data/Size"
import { Vector2 } from "../data/Vector2"
import { CircleRigid } from "./CircleRigid"
import { Contact } from "../collision/Contact"
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

    private _points: Vector2[] | undefined
    public get points(): Vector2[] {
        if (this._points === undefined) {
            let lt = this.halfExtendMin.copy()
            let lb = new Vector2(this.halfExtendMin.x, this.halfExtendMin.y + this.size.h)
            let rb = this.halfExtendMax.copy()
            let rt = new Vector2(this.halfExtendMax.x, this.halfExtendMax.y - this.size.h)
            this._points = [lt, lb, rb, rt]
        }
        return this._points
    }

    constructor(size: Size, offset?: Vector2, density?: number) {
        super(density)
        this._size = size
        this.offset = offset || new Vector2()
        this.calcMass()
        this.calcInertia()
    }
    calcMass(): void {
        this.mass = this.size.w * this.size.h * this.density
    }

    drawDebug(ctx: CanvasRenderingContext2D): void {
        let pos = this.pos.copy().add(this.offset)
        ctx.save()
        ctx.strokeStyle = "#ff0000"
        ctx.translate(pos.x, pos.y)
        ctx.beginPath()
        ctx.rotate(this.angle)
        ctx.strokeRect(-this.size.w / 2, -this.size.h / 2, this.size.w, this.size.h)
        ctx.closePath()
        ctx.translate(-pos.x, -pos.y)
        ctx.restore()
    }
}
