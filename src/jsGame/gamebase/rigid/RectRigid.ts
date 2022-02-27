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
    w:number
    h:number
    constructor(w: number, h: number, offset?: Vector2, density?: number) {
        super(density)
        this.w = w
        this.h = h
        let lt = Vector2.new(0, 0)
        let lb = Vector2.new(w, 0)
        let rb = Vector2.new(w, h)
        let rt = Vector2.new(0, h)
        this._points = [lt, lb, rb, rt]
        this.offset = offset || new Vector2()
    }

    drawDebug(ctx: CanvasRenderingContext2D): void {
        super.drawDebug(ctx)
        let pos = this.pos.copy().add(this.offset)
        ctx.save()
        ctx.strokeStyle = "#ff0000"
        ctx.translate(pos.x, pos.y)
        ctx.beginPath()
        ctx.rotate(this.angle)
        ctx.strokeRect(-this.w / 2, -this.h / 2, this.w, this.h)
        ctx.closePath()
        ctx.translate(-pos.x, -pos.y)
        ctx.restore()
    }
}
