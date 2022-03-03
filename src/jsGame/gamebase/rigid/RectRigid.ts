import { AxisInfo } from "../data/AxisInfo"
import { Bound } from "../data/Bound"
import { Vector2 } from "../data/Vector2"
import { CircleRigid } from "./CircleRigid"
import { Contact } from "../collision/Contact"
import { RigidBase } from "./RigidComponent"
import { TriangleRigid } from "./TriangleRigid"
import { BaseSence } from "../BaseSence"
import { Game } from "../Game"

export class RectRigid extends RigidBase {
    // private _halfMin: Vector2 | undefined
    // public get halfExtendMin(): Vector2 {
    //     if (this._halfMin === undefined) {
    //         this._halfMin = new Vector2(-this.bound.w / 2, -this.bound.h / 2).add(this.offset)
    //     }
    //     return this._halfMin
    // }
    // private _halfMax: Vector2 | undefined
    // public get halfExtendMax(): Vector2 {
    //     if (this._halfMax === undefined) {
    //         this._halfMax = new Vector2(this.bound.w / 2, this.bound.h / 2).add(this.offset)
    //     }
    //     return this._halfMax
    // }

    private _points: Vector2[]
    public get points(): Vector2[] {
        // if (this._points === undefined) {
        //     let lt = Vector2.new(0, 0)
        //     let lb = Vector2.new(this.bound.w, 0)
        //     let rb = Vector2.new(this.bound.w, this.bound.h)
        //     let rt = Vector2.new(0, this.bound.h)
        //     this._points = [lt, lb, rb, rt]
        // }
        return this._points
    }
    w: number
    h: number
    constructor(w: number, h: number, offset?: Vector2, density?: number) {
        super(density)
        this.w = w
        this.h = h
        let v1 = Vector2.new(0, 0)
        let v2 = Vector2.new(w, 0)
        let v3 = Vector2.new(w, h)
        let v4 = Vector2.new(0, h)
        this._points = [v1, v2, v3, v4]
        this.offset = offset || new Vector2()
    }

    drawDebug(ctx: CanvasRenderingContext2D): void {
        super.drawDebug(ctx)
        let pos = this.pos.copy().add(this.offset)
        ctx.save()
        ctx.strokeStyle = "#ff0000"
        ctx.beginPath()
        for (const p of this.vertexs) {
            ctx.lineTo(p.x, p.y)
        }
        ctx.closePath()
        ctx.stroke()
        // draw bound
        ctx.strokeStyle = "#a9a9a9"
        ctx.beginPath()
        for (const v of this.bound.paths) {
            ctx.lineTo(v.x, v.y)
        }
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
    }
}
