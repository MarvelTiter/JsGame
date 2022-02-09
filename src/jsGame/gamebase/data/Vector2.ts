/**
 * 二维向量
 */
export class Vector2 {
  x: number;
  y: number;
  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  copy() {
    var vec = new Vector2(this.x, this.y);
    return vec;
  }

  set(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }
  
  /**
   * 
   * @param value
   * @returns
   */
  multiply(value: number): Vector2 {
    this.x = this.x * value;
    this.y = this.y * value;
    return this;
  }

  /**
   * 向量相加
   * @param {Vector2} vec
   */
  add(vec: Vector2): Vector2 {
    this.x = this.x + vec.x;
    this.y = this.y + vec.y;
    return this;
  }
  /**
   * 向量相减
   * @param vec 
   * @returns 
   */
  subtract(vec: Vector2): Vector2 {
    this.x = this.x - vec.x;
    this.y = this.y - vec.y;

    return this;
  }
  /**
   * 向量的长度
   * @return {Number}
   */
  getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * 向量的模
   * @returns {Vector2}
   */
  getNormal(): Vector2 {
    var length = this.getLength();
    return new Vector2(this.x / length, this.y / length);
  }

  /**
   * 向量旋转
   * @param {Number} theta
   */
  rotate(theta: number): Vector2 {
    var rotatedX = this.x * Math.cos(theta) - this.y * Math.sin(theta);
    var rotatedY = this.x * Math.sin(theta) + this.y * Math.cos(theta);

    return this.set(rotatedX, rotatedY);
  }

  /**
   * 向量点积
   * @param  {Vector2} vec
   * @return {Vector2}
   */
  dotProduct(vec: Vector2): number {
    return this.x * vec.x + this.y * vec.y;
  }
}
