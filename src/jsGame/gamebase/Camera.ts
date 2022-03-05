import { clamp } from "../../utils/helper"
import { BaseSence } from "./BaseSence"
import { Bound } from "./data/Bound"
import { IRect } from "./data/Rect"
import { Vector2 } from "./data/Vector2"
import { Game } from "./Game"
import { GameObject } from "./objects/GameObject"
type Direction = "Horizontal" | "Vertical" | "Both" | "Static"
export interface ITraceable {
    getPosInfo(): {
        velocity: Vector2
        pos: Vector2
    }
}
export class Camera {
    target: ITraceable | undefined
    pos: Vector2
    direction: Direction
    window: IRect
    sence: BaseSence
    constructor(sence: BaseSence, window: IRect, direction?: Direction) {
        this.sence = sence
        this.direction = direction ?? "Static"
        this.window = window
        this.pos = new Vector2()
    }
    public bind<T extends ITraceable>(gameObj: T): void {
        this.target = gameObj
    }

    public getCenter(): Vector2 {
        return new Vector2(this.pos.x + this.window.w / 2, this.pos.y + this.window.h / 2)
    }

    public getPosition(): Vector2 {
        return this.pos.copy()
    }

    private _max: Vector2 | undefined
    get max(): Vector2 {
        if (this._max === undefined) {
            this._max = Vector2.new(this.sence.maxX, this.sence.maxY)
        }
        return this._max
    }

    private _min: Vector2 | undefined
    get min(): Vector2 {
        if (this._min === undefined) {
            this._min = Vector2.new(this.sence.minX, this.sence.minY)
        }
        return this._min
    }

    private getNewPos(velocity: Vector2, targetPos: Vector2): Vector2 {
        let newPos = this.pos.copy().add(velocity)
        let { w, h } = this.window
        if (targetPos.x < this.min.x + w / 2) {
            newPos.x = this.min.x
        } else if (targetPos.x > this.max.x - w / 2) {
            newPos.x = this.max.x - w
        }
        if (targetPos.y < this.min.y + h / 2) {
            newPos.y = this.min.y
        } else if (targetPos.y > this.max.y - h / 2) {
            console.log(2)
            newPos.y = this.max.y - h
        }
        return newPos
    }

    public trace(ctx: CanvasRenderingContext2D): void {
        if (this.target !== undefined) {
            let { velocity, pos } = this.target.getPosInfo()
            let newPos = this.getNewPos(velocity, pos)
            let delta = newPos.sub(this.pos)
            switch (this.direction) {
                case "Static":
                    delta.set(0, 0)
                    break
                case "Horizontal":
                    delta.y = 0
                    break
                case "Vertical":
                    delta.x = 0
                    break
                case "Both":
                    break
            }
            ctx.translate(-delta.x, -delta.y)
            this.pos.add(delta)
        }
        ctx.clearRect(this.pos.x, this.pos.y, this.window.w, this.window.h)
    }
}
