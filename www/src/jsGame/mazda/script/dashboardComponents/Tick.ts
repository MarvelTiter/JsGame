import { text } from "stream/consumers";
import { Vector2 } from "../../../gamebase/data/Vector2";
import { PartialBase } from "./PartialBase";

export class Tick extends PartialBase {

    constructor(pos: Vector2, radius: number) {
        super(pos, radius)
        this.count = 5
        this.start = Vector2.new(this.pos.x, 0)
    }
    start: Vector2

    private _length: number = 5
    public get length(): number {
        return this._length
    }
    public set length(v: number) {
        this._length = v
    }

    private step!: number
    private _count!: number
    public get count() {
        return this._count
    }
    public set count(value) {
        this._count = value
        this.step = Math.abs(this.endAngle - this.startAngle) / this.count
    }


    private _width: number = 5
    public get width(): number {
        return this._width
    }
    public set width(v: number) {
        this._width = v
    }


    update(): void {

    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.width
        for (let index = 0; index <= this.count; index++) {
            const angle = this.startAngle + this.step * index
            const n = this.start.rotateTo(angle).normalizeTo()
            const sp = n.multiTo(this.radius - this.length!).add(this.pos)
            const ep = n.multiTo(this.radius).add(this.pos)
            ctx.beginPath()
            ctx.moveTo(sp.x, sp.y)
            ctx.lineTo(ep.x, ep.y)
            ctx.closePath()
            ctx.stroke()
        }
        ctx.restore()
    }
}
