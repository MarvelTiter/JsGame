import { Vector2, Vertex } from "../data/Vector2"
import { RigidBase } from "./RigidBase"

export class Vertices {
    private _vertexs: Vertex[]
    get vertexs(): Vertex[] {
        return this._vertexs
    }
    private _axes: Vector2[]
    get axes(): Vector2[] {
        return this._axes
    }
    constructor(points: Vector2[], body: RigidBase) {
        this._vertexs = []
        for (let i = 0; i < points.length; i++) {
            const p = points[i]
            this._vertexs.push(new Vertex(p, i, body))
        }
        let temp: any = {}
        for (var i = 0; i < this._vertexs.length; i++) {
            var j = (i + 1) % this._vertexs.length
            let head = this._vertexs[i].point
            let tail = this._vertexs[j].point
            let normal = Vector2.new(tail.y - head.y, head.x - tail.x).normalize()
            let g: number | string = normal.y === 0 ? Infinity : normal.x / normal.y
            // 粗略精度
            g = g.toFixed(3).toString()
            // 去除重复的轴
            temp[g] = normal
        }
        this._axes = Object.values(temp)
    }
    fixOrigin(offset: Vector2) {
        let centreOffset = this.centre().multi(-1).add(offset)
        this.translate(centreOffset)
    }
    translate(offset: Vector2) {
        for (const v of this.vertexs) {
            v.point.add(offset)
        }
    }
    rotate(angle: number, pos: Vector2) {
        if (Math.sign(angle) === 0) return
        let cos = Math.cos(angle)
        let sin = Math.sin(angle)
        for (const v of this.vertexs) {
            let dx = v.x - pos.x
            let dy = v.y - pos.y
            v.point.x = pos.x + (dx * cos - dy * sin)
            v.point.y = pos.y + (dx * sin + dy * cos)
            // v.point.rotate(angle)
        }
        this.axesRotate(angle)
    }
    axesRotate(angle: number) {
        if (angle === 0) return

        var cos = Math.cos(angle),
            sin = Math.sin(angle)

        for (const axis of this._axes) {
            axis.x = axis.x * cos - axis.y * sin
            axis.y = axis.x * sin + axis.y * cos
        }
    }
    area(signed: boolean = false): number {
        let area = 0
        let Vertexes = this.vertexs
        var j = Vertexes.length - 1
        for (let i = 0; i < this.vertexs.length; i++) {
            area += (Vertexes[j].x - Vertexes[i].x) * (Vertexes[j].y + Vertexes[i].y)
            j = i
        }
        if (signed) return area / 2
        return Math.abs(area) / 2
    }
    centre(): Vector2 {
        let area = this.area(true)
        let centre = new Vector2()
        let Vertexes = this.vertexs
        for (var i = 0; i < Vertexes.length; i++) {
            var j = i == Vertexes.length - 1 ? 0 : i + 1
            var cross = Vertexes[i].cross(Vertexes[j])
            var temp = Vertexes[i].add(Vertexes[j]).multi(cross)
            centre.add(temp)
        }
        return centre.multi(1 / (6 * area))
    }
    /**
     * 根据多边形计算转动惯量
     */
    inertia(mass: number): number {
        let numerator = 0,
            denominator = 0,
            v = this.vertexs,
            cross,
            j

        // find the polygon's moment of inertia, using second moment of area
        // from equations at http://www.physicsforums.com/showthread.php?t=25293
        for (var n = 0; n < v.length; n++) {
            j = (n + 1) % v.length
            cross = Math.abs(v[j].cross(v[n]))
            numerator += cross * (v[j].dot(v[j]) + v[j].dot(v[n]) + v[n].dot(v[n]))
            denominator += cross
        }
        return (mass / 6) * (numerator / denominator)
    }
    /**
     * 给定的点是否在多边形中
     * @param point
     * @returns
     */
    contains(testVertex: Vertex): boolean {
        let vertices = this.vertexs
        let verticesLength = vertices.length
        for (var i = 0; i < verticesLength; i++) {
            let j = i == verticesLength - 1 ? 0 : i + 1
            let vertice = vertices[i]
            let nextVertice = vertices[j]
            // 顶点与点的连线的向量与边的法向量的点积，如果大于0，说明是锐角，在多边形外面
            if ((testVertex.x - vertice.x) * (nextVertice.y - vertice.y) + (testVertex.y - vertice.y) * (vertice.x - nextVertice.x) > 0) {
                return false
            }
        }
        return true
    }
}
