import { Vertices } from "../rigid/Vertices"
import { IRect } from "./Rect"
import { Vector2 } from "./Vector2"

export class Bound {
    min: Vector2 = new Vector2()
    max: Vector2 = new Vector2()
    
    update(vertices: Vertices, velocity: Vector2) {
        this.max.set(-Infinity, -Infinity)
        this.min.set(Infinity, Infinity)
        for (const vertex of vertices.vertexs) {
            // this.max.max(vertex.point)
            // this.min.min(vertex.point)
            // console.log(this.max, this.min)
            if (vertex.point.x > this.max.x) this.max.x = vertex.point.x
            if (vertex.point.y > this.max.y) this.max.y = vertex.point.y
            if (vertex.point.x < this.min.x) this.min.x = vertex.point.x
            if (vertex.point.y < this.min.y) this.min.y = vertex.point.y
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
    get paths(): Vector2[] {
        return [
            Vector2.new(this.min.x, this.min.y),
            Vector2.new(this.max.x, this.min.y),
            Vector2.new(this.max.x, this.max.y),
            Vector2.new(this.min.x, this.max.y)
        ]
    }    
}
