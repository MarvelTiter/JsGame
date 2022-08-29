import { PartialBase } from "./PartialBase";

export class Panel extends PartialBase {
    update(): void {

    }
    draw(ctx: CanvasRenderingContext2D): void {
        const { x, y } = this.pos
        // ctx.lineWidth = 5
        ctx.fillStyle = "black"
        ctx.beginPath()
        ctx.arc(x, y, this.radius, this.startAngle, this.endAngle)
        // ctx.closePath()
        ctx.stroke()
    }
}
