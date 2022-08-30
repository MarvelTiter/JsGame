import { Vector2 } from "../../../gamebase/data/Vector2";
import { PartialBase } from "./PartialBase";
export type LabelPosition = "TickLabel" | "Bottom" | "Up"
export type textAlign = "left" | "right" | "center" | "start" | "end"
export type textBaseline = "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom"
type drawLabel = (ctx: CanvasRenderingContext2D) => void
export class Label extends PartialBase {

    constructor(pos: Vector2, radius: number) {
        super(pos, radius)
        this.count = 5
        this.start = Vector2.new(this.pos.x, 0)
        this.labelPosition = "TickLabel"
    }

    private _labelPosition!: LabelPosition;
    public get labelPosition(): LabelPosition {
        return this._labelPosition
    }
    public set labelPosition(v: LabelPosition) {
        this._labelPosition = v
        if (v == "TickLabel") {
            this.render = this.drawTickLabel
        } else if (v == "Bottom") {
            this.render = this.drawBottomLabel
        } else if (v == "Up") {
            this.render = this.drawUpLabel
        }
    }

    font: string = "10px sans-serif"
    text?: string
    offset: number = 5
    textAlign: textAlign = "center"
    start: Vector2
    private angleStep!: number
    private valueStep!: number
    private _count!: number
    private render!: drawLabel
    public get count() {
        return this._count
    }
    public set count(value) {
        this._count = value
        this.angleStep = Math.abs(this.endAngle - this.startAngle) / this.count
        this.valueStep = Math.floor((this.maxValue! - this.minValue!) / this.count)
    }



    update(): void {

    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        ctx.strokeStyle = this.color
        ctx.font = this.font
        ctx.textAlign = this.textAlign
        this.render(ctx)
        ctx.restore()
    }

    drawTickLabel(ctx: CanvasRenderingContext2D) {
        ctx.textBaseline = "middle"
        for (let index = 0; index <= this.count; index++) {
            const angle = this.startAngle + this.angleStep * index
            const n = this.start.rotateTo(angle).normalizeTo()
            const sp = n.multiTo(this.offset).add(this.pos)
            const v = this.minValue! + this.valueStep * index
            ctx.fillText(v.toString(), sp.x, sp.y)
        }
    }

    drawBottomLabel(ctx: CanvasRenderingContext2D) {
        ctx.textBaseline = "bottom"
        ctx.fillText(this.text!, this.pos.x, this.pos.y + this.offset)
    }

    drawUpLabel(ctx: CanvasRenderingContext2D) {

    }
}
