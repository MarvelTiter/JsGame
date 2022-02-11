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

    /**
     *
     * @param value
     * @returns
     */
    multi(value: number): Vector2 {
        return new Vector2(this.x * value, this.y * value)
    }

    /**
     * 向量相加
     * @param {Vector2} vec
     */
    add(vec: Vector2): Vector2 {
        return new Vector2(this.x + vec.x, this.y + vec.y)
    }
    /**
     * 向量相减
     * @param vec
     * @returns
     */
    sub(vec: Vector2): Vector2 {
        return new Vector2(this.x - vec.x, this.y - vec.y)
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

    /**
     * 向量点积
     * @param  {Vector2} vec
     * @return {Vector2}
     */
    dot(vec: Vector2): number {
        return this.x * vec.x + this.y * vec.y
    }
}
