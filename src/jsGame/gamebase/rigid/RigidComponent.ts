import { AxisInfo } from "../data/AxisInfo"
import { Vector2, Vertex } from "../data/Vector2"
import { GameObject } from "../objects/GameObject"
import { Contact } from "../collision/Contact"

const gravity = 10
type ShapeType = "Circle" | "Rect" | "Triangle"

const nextId = (function (): Function {
    let count = 1
    return function () {
        return count++
    }
})()
export function GetContactId(rigidA: RigidBase, rigidB: RigidBase): string {
    if (rigidA.id > rigidB.id) {
        return `A${rigidB.id}B${rigidA.id}`
    } else {
        return `A${rigidA.id}B${rigidB.id}`
    }
}
export abstract class RigidBase {
    id: number
    force: Vector2 = new Vector2()
    posPrev: Vector2 | undefined
    target!: GameObject
    parts!: RigidBase[]
    parnet!: RigidBase
    velocity: Vector2 = new Vector2()
    offset: Vector2 = new Vector2()
    // angle: number = 0
    anglePrev: number | undefined
    /**
     * 角速度
     */
    angularVelocity: number = 0
    /**
     * 扭矩
     */
    torque: number = 0
    /**
     * 质量
     */
    mass!: number
    /**
     * 密度
     */
    density: number
    /**
     * 1 / 质量， 求加速度 a = f / mass = f * invMass
     */
    get invMass(): number {
        if (this.mass === 0 || this.mass === Infinity) return 0
        return 1 / this.mass
    }
    /**
     * 惯性
     */
    inertia: number = 1
    /**
     *
     */
    get invInertia(): number {
        if (this.inertia === 0 || this.inertia === Infinity) return 0
        return 1 / this.inertia
    }
    /**
     * 摩擦力
     */
    friction: number = 0.1
    /**
     * 最大静摩擦力
     */
    frictionStatic: number = 0.3
    /**
     * 空气摩擦力
     * 默认值 0.01
     */
    frictionAir: number = 0.01
    /**
     * 恢复系数（e）是碰撞前后两物体沿接触处法线方向上的分离速度与接近速度之比，只与碰撞物体的材料有关。弹性碰撞时e=1；完全非弹性碰撞时e=0
     */
    restitution: number = 0.3
    /**
     * 指定允许物体“下沉”或旋转到其他物体的距离的公差
     */
    slop: number = 0.05
    /**
     * 碰撞关联其他物体的数量
     */
    totalRelates: number = 0
    /**
     * 是否静态
     */
    isStatis: boolean = false
    positionImpulse: Vector2 = Vector2.new(0, 0)

    private posHasChanged: boolean = false
    /**
     * 整体旋转角度/弧度
     */
    public get angle(): number {
        return this.target.theta
    }
    public set angle(v: number) {
        this.target.theta = v
    }

    public get pos(): Vector2 {
        return this.target.pos
    }

    public set pos(p: Vector2) {
        this.target.pos.set(p.x, p.y)
    }

    protected thetaChanged: boolean = false

    private _apCache: Vertex[] | undefined
    constructor(density?: number) {
        this.density = density || 1
        this.id = nextId()
    }
    /**
     * 绘制在坐标轴中的实际坐标
     */
    public get actualPoints(): Vertex[] {
        // if (this.thetaChanged || this.posHasChanged || this._apCache === undefined) {
        // this._apCache = []
        let ret = []
        for (let i = 0; i < this.points.length; i++) {
            const p = this.points[i]
            ret.push({
                point: p.copy().rotate(this.angle).add(this.pos),
                index: i,
                belonged: this
            })
        }
        // this.thetaChanged = false
        // this.posHasChanged = false
        // }
        return ret
    }
    bind(obj: GameObject) {
        this.target = obj
        this.angle = obj.theta
    }
    setStatis() {
        this.isStatis = true
        this.restitution = 0
        this.friction = 1
        this.mass = this.inertia = this.density = Infinity
        this.posPrev = this.pos
        this.anglePrev = this.angle
        this.angularVelocity = 0
    }
    /**
     * 凸多边形各边的法向量（投影轴
     */
    _axes: Vector2[] | undefined
    getAxes(): Vector2[] {
        // if (this.thetaChanged || this.posHasChanged || this._axes === undefined) {
        let axes: any = {}
        let points = this.actualPoints
        for (var i = 0; i < points.length; i++) {
            var j = (i + 1) % points.length
            let head = points[i].point
            let tail = points[j].point
            let normal = Vector2.new(tail.y - head.y, head.x - tail.x).normalize()
            let g: number | string = normal.y === 0 ? Infinity : normal.x / normal.y
            // 粗略精度
            g = g.toFixed(3).toString()
            // 去除重复的轴
            axes[g] = normal
        }
        // this._axes = Object.values(axes)
        // }
        // return this._axes
        return Object.values(axes)
    }
    /**
     * 给定的点是否在多边形中
     * @param point
     * @returns
     */
    contains(point: Vector2): boolean {
        let vertices = this.actualPoints,
            pointX = point.x,
            pointY = point.y,
            verticesLength = vertices.length,
            vertex = vertices[verticesLength - 1],
            nextVertex
        for (var i = 0; i < verticesLength; i++) {
            nextVertex = vertices[i]
            // 顶点与点的连线的向量与边的法向量的点积，如果大于0，说明是锐角，在多边形外面
            if ((pointX - vertex.point.x) * (vertex.point.y - nextVertex.point.y) + (pointY - vertex.point.y) * (nextVertex.point.x - vertex.point.x) > 0) {
                return false
            }
            vertex = nextVertex
        }
        return true
    }
    /**
     * 更新重力
     */
    applyGravity(g: Vector2) {
        this.force.add(g.copy().multi(this.mass))
    }
    clearForce() {
        this.force.set(0, 0)
        this.torque = 0
    }
    /**
     * 定义多边形的顶点(原点(0,0))
     */
    abstract get points(): Vector2[]
    /**
     * 计算多边形面积，用作质量
     */
    abstract calcMass(): void
    /**
     * 根据多边形计算惯性, points初始化之后才能调用
     */
    calcInertia(): void {
        let numerator = 0,
            denominator = 0,
            v = this.points,
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
        this.inertia = (this.mass / 6) * (numerator / denominator)
    }
    drawDebug(ctx: CanvasRenderingContext2D): void {}
    update(): void {
        if (this.isStatis) return
        let deltaTimeSquared = Math.pow(1000 / 60, 2)

        // from the previous step     global timeScale   self timeScale
        let frictionAir = 1 - this.frictionAir * 1 * 1,
            velocityPrev = this.pos.copy().sub(this.posPrev ?? this.pos)

        // update velocity with Verlet integration
        velocityPrev.multi(frictionAir).add(this.force.copy().multi(this.invMass * deltaTimeSquared))

        this.velocity = velocityPrev
        this.posPrev = this.pos.copy()
        this.pos.add(this.velocity)

        this.angularVelocity = (this.angle - (this.anglePrev ?? this.angle)) * frictionAir + this.torque * this.invInertia * deltaTimeSquared
        this.anglePrev = this.angle
        this.angle += this.angularVelocity

        // track speed and acceleration
        // this.speed = this.velocity.length
        // this.angularSpeed = Math.abs(this.angularVelocity)
    }
}
