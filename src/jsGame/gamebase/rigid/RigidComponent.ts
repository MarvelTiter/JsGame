import { AxisInfo } from "../data/AxisInfo"
import { Vector2 } from "../data/Vector2"
import { GameObject } from "../objects/GameObject"
import { Contact } from "./Contact"

const gravity = 10
type ShapeType = "Circle" | "Rect" | "Triangle"
export abstract class RigidBase {
    mass: number
    invMass: number
    force: Vector2 = new Vector2()
    pos: Vector2 = new Vector2()
    type: ShapeType
    target!: GameObject
    // 碰撞检测的时候，与比较物体最近的点

    // 整体旋转角度/弧度
    private _theta: number = 0
    private posHasChanged: boolean = false
    public get theta(): number {
        return this._theta
    }
    public set theta(v: number) {
        if (v === this._theta) return
        this.thetaChanged = true
        this._theta = v
    }

    protected thetaChanged: boolean = false

    private _apCache: Vector2[] | undefined
    /**
     * 绘制在坐标轴中的实际坐标
     */
    public get actualPoints(): Vector2[] {
        if (this.thetaChanged || this.posHasChanged || this._apCache === undefined) {
            this._apCache = []
            for (const p of this.points) {
                this._apCache.push(p.copy().rotate(this.theta).add(this.pos))
            }
            this.thetaChanged = false
            this.posHasChanged = false
        }
        return this._apCache
    }
    constructor(type: ShapeType, mass?: number) {
        this.type = type
        this.mass = mass ?? 0
        if (this.mass === 0) {
            this.invMass = 0
        } else {
            this.invMass = 1 / this.mass
        }
    }
    bind(obj: GameObject) {
        this.target = obj
    }
    update(): void {
        if (!this.pos.equal(this.target.pos)) {
            this.posHasChanged = true
            this.pos.set(this.target.pos.x, this.target.pos.y)
        }
        this.theta = this.target.theta
    }
    /**
     * 凸多边形各边的法向量（投影轴
     */
    abstract getAxis(): AxisInfo[]
    /**
     * 定义多边形的顶点(原点(0,0))
     */
    abstract get points(): Vector2[]

    abstract getClosestPoint(rigid: RigidBase): Contact[]
    drawDebug(ctx: CanvasRenderingContext2D): void {}
}
