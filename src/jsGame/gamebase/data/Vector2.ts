import { clamp } from "../../../utils/helper"
import { RigidBase } from "../rigid/RigidBase"

/**
 * 二维向量
 */
export class Vector2 {
    x: number
    y: number
    constructor(x?: number, y?: number) {
        this.x = x || 0
        this.y = y || 0
    }

    static new(x: number, y: number) {
        return new Vector2(x, y)
    }

    public static zero(): Vector2 {
        return new Vector2(0, 0)
    }

    set(x: number, y: number): Vector2 {
        this.x = x
        this.y = y
        return this
    }

    copy(): Vector2 {
        return new Vector2(this.x, this.y)
    }

    /**
     *
     * @param value
     * @returns
     */
    multi(value: number): Vector2 {
        this.x = this.x * value
        this.y = this.y * value
        return this
    }

    /**
     * 向量相加
     * @param {Vector2} vec
     */
    add(vec: Vector2): Vector2 {
        this.x = this.x + vec.x
        this.y = this.y + vec.y
        return this
    }
    /**
     * 向量相减
     * @param vec
     * @returns
     */
    sub(vec: Vector2): Vector2 {
        this.x = this.x - vec.x
        this.y = this.y - vec.y
        return this
    }
    /**
     * 向量的长度
     * @return {Number}
     */
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    /**
     * 模向量
     * @returns {Vector2}
     */
    normalize(): Vector2 {
        let length = this.length()
        this.x = this.x / length
        this.y = this.y / length
        return this
    }

    /**
     * 法向量 / 切线
     * @returns {Vector2}
     */
    normal(): Vector2 {
        let { x, y } = this
        this.x = -y
        this.y = x
        return this
    }
    /**
     * 向量旋转
     * @param {Number} theta
     */
    rotate(theta: number): Vector2 {
        let rotatedX = this.x * Math.cos(theta) - this.y * Math.sin(theta)
        let rotatedY = this.x * Math.sin(theta) + this.y * Math.cos(theta)
        return this.set(rotatedX, rotatedY)
    }

    rotateAbout(angle: number, p: Vector2): Vector2 {
        let cos = Math.cos(angle)
        let sin = Math.sin(angle)
        let x = p.x + ((this.x - p.x) * cos - (this.y - p.y) * sin)
        this.y = p.y + ((this.x - p.x) * sin + (this.y - p.y) * cos)
        this.x = x
        return this
    }

    max(maxVec: Vector2): Vector2 {
        if (this.x < maxVec.x) this.x = maxVec.x
        if (this.y < maxVec.y) this.y = maxVec.y
        return this
    }

    min(minVec: Vector2): Vector2 {
        if (this.x > minVec.x) this.x = minVec.x
        if (this.y > minVec.y) this.y = minVec.y
        return this
    }

    equal(vec: Vector2): boolean {
        let deltaX = this.x - vec.x
        let deltaY = this.y - vec.y

        return Math.abs(deltaX) < 0.00001 && Math.abs(deltaY) < 0.00001
    }

    /**
     * 向量点积
     * @param  {Vector2} vec
     * @return {Vector2}
     */
    dot(vec: Vector2): number {
        return this.x * vec.x + this.y * vec.y
    }
    /**
     * 向量叉积
     * @param {Vector2} vec
     */
    cross(vec: Vector2): number {
        return this.x * vec.y - this.y * vec.x
    }
    /**
     * atan2
     * @returns
     */
    angle(): number {
        return Math.atan2(this.y, this.x)
    }
    /**
     * 向量的夹角(返回弧度)
     * @param vec
     */
    includedAngle(vec: Vector2): number {
        let sl = this.length()
        let ol = vec.length()
        if (sl === 0 || ol === 0) return 0
        let cos = this.dot(vec) / sl / ol
        cos = clamp(cos, -1, 1)
        return Math.acos(cos)
    }
}

export class Vertex {
    point: Vector2
    index: number
    belonged: RigidBase
    get x(): number {
        return this.point.x
    }
    get y(): number {
        return this.point.y
    }
    constructor(p: Vector2, index: number, parent: RigidBase) {
        this.point = p
        this.index = index
        this.belonged = parent
    }
    cross(ver: Vertex): number {
        return this.point.cross(ver.point)
    }
    dot(ver: Vertex | Vector2): number {
        if (ver instanceof Vertex) {
            return this.point.dot(ver.point)
        } else {
            return this.point.dot(ver)
        }
    }
    add(ver: Vertex | Vector2): Vector2 {
        if (ver instanceof Vertex) {
            return this.point.copy().add(ver.point)
        } else {
            return this.point.copy().add(ver)
        }
    }
    sub(vec: Vector2): Vector2 {
        return this.point.copy().sub(vec)
    }
}
