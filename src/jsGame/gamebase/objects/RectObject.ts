import { BaseSence } from "../BaseSence"
import { Size } from "../data/Size"
import { Vector2 } from "../data/Vector2"
import { Game } from "../Game"
import { GameObject } from "../GameObject"
class matrix {
    cos: number = 0.0
    sin: number = 0.0
    pos: Vector2 = new Vector2()
    ang: number = 0.0
    set(a: number, pos: Vector2) {
        this.cos = Math.cos(a)
        this.sin = Math.sin(a)
        this.pos = pos.copy()
    }
}
export class RectObject extends GameObject {
    theta: number = 0
    stokeStyle: string = "#000000"
    matrix: matrix
    public get halfExtendMin(): Vector2 {
        return new Vector2(-this.size.w / 2, -this.size.h / 2)
    }
    public get halfExtendMax(): Vector2 {
        return new Vector2(this.size.w / 2, this.size.h / 2)
    }
    constructor(game: Game, sence: BaseSence) {
        super(game, sence)
        this.id = "Rect"
        this.matrix = new matrix()
        this.matrix.set(0, this.pos)
    }
    update(): void {
        this.theta += (1 / 300) * Math.PI
        this.matrix.set(this.theta, new Vector2())
    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        ctx.strokeStyle = this.stokeStyle
        ctx.translate(this.pos.x, this.pos.y)
        ctx.beginPath()
        ctx.rotate(this.theta)
        ctx.strokeRect(-this.size.w / 2, -this.size.h / 2, this.size.w, this.size.h)
        ctx.closePath()
        ctx.translate(-this.pos.x, -this.pos.y)
        ctx.restore()
    }
}
