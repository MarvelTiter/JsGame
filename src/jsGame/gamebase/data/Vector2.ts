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
     * 向量的模
     * @returns {Vector2}
     */
    normalize(): Vector2 {
        var length = this.length()
        return new Vector2(this.x / length, this.y / length)
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

    /**
     * 向量点积
     * @param  {Vector2} vec
     * @return {Vector2}
     */
    dot(vec: Vector2): number {
        return this.x * vec.x + this.y * vec.y
    }
}
