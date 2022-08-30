import { Vector2 } from "../../../gamebase/data/Vector2";
import { PartialBase } from "./PartialBase";

export class Needle extends PartialBase {
    value!: number
    start: Vector2
    deltaTheta: number
    deltaValue: number;
    constructor(pos: Vector2, radius: number) {
        super(pos, radius)
        this.start = Vector2.new(this.pos.x, 0)
        this.deltaTheta = this.endAngle - this.startAngle
        this.deltaValue = (this.maxValue! - this.minValue!)
    }

    updateDelta() {
        this.deltaTheta = this.endAngle - this.startAngle
        this.deltaValue = (this.maxValue! - this.minValue!)
    }

    update(): void {

    }
    tailOffset: number = 20
    headOffset: number = 20
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        const angle = (this.value / this.deltaValue) * this.deltaTheta + this.startAngle
        const n = this.start.rotateTo(angle).normalizeTo()
        const sp = n.multiTo(this.tailOffset).addTo(this.pos)
        const np = n.multiTo(this.radius - this.headOffset).addTo(this.pos)

        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.moveTo(sp.x, sp.y)
        ctx.lineTo(np.x, np.y)
        ctx.stroke()
        ctx.restore()
    }
}
