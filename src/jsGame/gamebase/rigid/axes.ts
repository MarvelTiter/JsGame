import { Vector2 } from "../data/Vector2"
import { Vertices } from "./vertices"

export class Axes {
    axes: Vector2[]
    constructor(vertices: Vertices) {
        let temp: any = {}
        let points = vertices.vertexs
        for (var i = 0; i < points.length; i++) {
            var j = (i + 1) % points.length
            let head = points[i].point
            let tail = points[j].point
            let normal = Vector2.new(tail.y - head.y, head.x - tail.x).normalize()
            let g: number | string = normal.y === 0 ? Infinity : normal.x / normal.y
            // 粗略精度
            g = g.toFixed(3).toString()
            // 去除重复的轴
            temp[g] = normal
        }
        this.axes = Object.values(temp)
    }
    rotate(angle: number) {
        if (angle === 0) return

        var cos = Math.cos(angle),
            sin = Math.sin(angle)

        for (const axis of this.axes.values()) {
            axis.x = axis.x * cos - axis.y * sin
            axis.y = axis.x * sin + axis.y * cos
        }
    }
}
