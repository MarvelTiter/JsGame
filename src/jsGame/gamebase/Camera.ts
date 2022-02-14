import { BaseSence } from "./BaseSence"
import { Size } from "./data/Size"
import { Vector2 } from "./data/Vector2"
import { Game } from "./Game"
import { GameObject } from "./objects/GameObject"
type Direction = "Horizontal" | "Vertical" | "Both" | "Static"

export class Camera {
    target: GameObject | undefined
    pos: Vector2
    direction: Direction
    ctx: CanvasRenderingContext2D
    window: Size
    sence: BaseSence
    constructor(sence: BaseSence, ctx: CanvasRenderingContext2D, window: Size, direction?: Direction) {
        this.sence = sence
        this.ctx = ctx
        this.pos = new Vector2()
        this.direction = direction ?? "Static"
        this.window = window
    }
    public bind<T extends GameObject>(gameObj: T): void {
        this.target = gameObj
    }

    public getCenter(): Vector2 {
        return new Vector2(this.pos.x + this.window.w / 2, this.pos.y + this.window.h / 2)
    }

    public getPosition(): Vector2 {
        return this.pos.copy()
    }

    public trace(): void {
        if (this.target !== undefined) {
            switch (this.direction) {
                case "Static":
                    break
                case "Horizontal":
                    this.ctx.translate(-this.target.offset.x, 0)
                    this.pos.add(new Vector2(this.target.offset.x, 0))
                    break
                case "Vertical":
                    this.ctx.translate(0, -this.target.offset.y)
                    this.pos.add(new Vector2(0, this.target.offset.y))
                    break
                case "Both":
                    this.ctx.translate(-this.target.offset.x, -this.target.offset.y)
                    this.pos.add(this.target.offset)
                    break
            }
        }
        let { maxX, minX, maxY, minY } = this.sence
        let { x, y } = this.pos
        let { w, h } = this.window
        if (maxX !== undefined) {
            if (x + w > maxX) x = maxX - w
        }
        if (minX !== undefined) {
            if (x < minX) x = minX
        }
        if (maxY !== undefined) {
            if (y + h > maxY) y = maxY - h
        }
        if (minY !== undefined) {
            if (y < minY) y = minY
        }
        // console.log(x, y, w, h)

        this.ctx.clearRect(x, y, w, h)
    }
}
