import { Vector2 } from "../../../gamebase/data/Vector2"

export abstract class PartialBase {
    startAngle: number
    endAngle: number
    maxValue?: number
    minValue?: number
    pos!: Vector2
    radius!: number
    color: string = "black"
    constructor(pos: Vector2, radius: number) {
        this.startAngle = 0
        this.endAngle = Math.PI * 2
        this.pos = pos
        this.radius = radius
    }

    abstract update(): void
    abstract draw(ctx: CanvasRenderingContext2D): void
}
