import { Vertices } from "../rigid/vertices"
import { Rect } from "./Rect"
import { Vector2 } from "./Vector2"

export class Bound {
    w: number
    h: number
    min: Vector2 = new Vector2()
    max: Vector2 = new Vector2()
    constructor(w?: number, h?: number) {
        this.w = w || 0
        this.h = h || 0
    }
    update(vertices: Vertices, velocity: Vector2) {
        this.max.set(-Infinity, -Infinity)
        this.min.set(Infinity, Infinity)
        for (const vertex of vertices.vertexs) {
            this.max.max(vertex.point)
            this.min.min(vertex.point)
            // console.log(this.max, this.min)
            // if (vertex.point.x > this.max.x) this.max.x = vertex.point.x
            // if (vertex.point.y > this.max.y) this.max.y = vertex.point.y
            // if (vertex.point.x < this.min.x) this.min.x = vertex.point.x
            // if (vertex.point.y < this.min.y) this.min.y = vertex.point.y
        }
        if (velocity.x > 0) {
            this.max.x += velocity.x
        } else {
            this.min.x += velocity.x
        }
        if (velocity.y > 0) {
            this.max.y += velocity.y
        } else {
            this.min.y += velocity.y
        }
    }
    div(p: number): Bound {
        this.w = this.w * p
        this.h = this.h * p
        return this
    }
    set(w: number, h: number): Bound {
        this.w = w
        this.h = h
        return this
    }
    copy() {
        return new Bound(this.w, this.h)
    }
}
