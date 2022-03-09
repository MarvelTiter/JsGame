import { Vector2 } from "../data/Vector2"
import { RigidBase } from "./RigidBase"

export class TriangleRigid extends RigidBase {
    private _dLength: number
    public get dLength() {
        return this._dLength
    }
    private _dTheta: number
    public get dTheta() {
        return this._dTheta
    }

    private _deltaY!: number
    private _points: Vector2[]
    public get points(): Vector2[] {
        return this._points
    }

    private cache: any
    /**
     * 三角形为等腰三角形，初始状态底边水平
     * @param len 重心到顶点的距离
     * @param theta 顶角的一半
     * @param density 密度
     */
    constructor(len: number, theta: number, offset?: Vector2, density?: number) {
        super(density)
        this._dLength = len
        this._dTheta = theta
        this.offset = offset || new Vector2()
        this._points = []
        let cos = Math.cos(this.dTheta)
        let sin = Math.sin(this.dTheta)
        let top = new Vector2(0, -this.dLength)
        this._deltaY = (2 * cos * cos - 1) * this.dLength
        let deltaX = 2 * cos * this.dLength * sin
        let bottomLeft = new Vector2(-deltaX, +this._deltaY)
        let bottomRight = new Vector2(+deltaX, +this._deltaY)
        this._points = [top, bottomRight, bottomLeft]
    }
}
