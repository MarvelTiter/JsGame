import { PartialBase } from "./PartialBase";

export class Panel extends PartialBase {
    update(): void {

    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        const { x, y } = this.pos
        ctx.lineWidth = 1
        ctx.strokeStyle = "black"
        ctx.beginPath()
        ctx.arc(x, y, this.radius, this.startAngle, this.endAngle)
        // ctx.closePath()
        ctx.stroke()
        ctx.restore()
    }
}
