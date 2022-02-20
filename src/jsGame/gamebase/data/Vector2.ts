import { RigidBase } from "../rigid/RigidComponent"

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
        var length = this.length()
        this.x = this.x / length
        this.y = this.y / length
        return this
    }

    /**
     * 法向量
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
        var rotatedX = this.x * Math.cos(theta) - this.y * Math.sin(theta)
        var rotatedY = this.x * Math.sin(theta) + this.y * Math.cos(theta)
        return this.set(rotatedX, rotatedY)
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
}

export interface Vertex {
    point: Vector2
    index: number
    belonged: RigidBase
}
