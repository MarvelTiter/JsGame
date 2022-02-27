import { AxisInfo } from "../data/AxisInfo"
import { Vector2, Vertex } from "../data/Vector2"
import { GameObject } from "../objects/GameObject"
import { Contact } from "../collision/Contact"
import { Vertices } from "./vertices"
import { Axes } from "./axes"
import { Bound } from "../data/Bound"
import { Game } from "../Game"
import { BaseSence } from "../BaseSence"

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
    target!: GameObject
    parts!: RigidBase[]
    parnet!: RigidBase
    velocity: Vector2 = new Vector2()
    offset: Vector2 = new Vector2()
    /**
     * 运动量  speed * speed + angularVelocity * angularVelocity
     */
    motion: number = 0
    /**
     * 速度大小
     */
    speed: number = 0
    /**
     * 角速度大小
     */
    angularSpeed: number = 0
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
     * 转动惯量
     */
    inertia!: number
    /**
     * 1 / 转动惯量
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
    isStatic: boolean = false
    /**
     * 是否已休眠
     */
    isSleeping: boolean = false
    /**
     *
     */
    timeScale: number = 1
    /**
     * 冲量
     */
    positionImpulse: Vector2 = Vector2.new(0, 0)
    /**
     * 多边形面积
     */
    area!: number
    /**
     * 整体旋转角度/弧度
     */
    public get angle(): number {
        // return this.angle
        return this.target.angle
    }
    public set angle(v: number) {
        // this.angle = v
        this.target.angle = v
    }
    anglePrev: number | undefined

    public get pos(): Vector2 {
        return this.target.pos
    }

    // public set pos(p: Vector2) {

    //     this.target.pos.set(p.x, p.y)
    // }
    posPrev: Vector2 = new Vector2()
    bound: Bound = new Bound()

    constructor(density?: number) {
        this.density = density || 0.001
        this.id = nextId().toString()
        this.parts = []
        this.parts.push(this)
    }

    /**
     * 绘制在坐标轴中的实际坐标
     */
    get vertexs(): Vertex[] {
        return this.vertices.vertexs
    }
    get axes(): Vector2[] {
        return this.axesMg.axes
    }
    vertices!: Vertices
    /**
     * 凸多边形各边的法向量（投影轴
     */
    axesMg!: Axes

    bind(obj: GameObject) {
        this.target = obj
    }

    init() {
        this.vertices = new Vertices(this.points, this)
        this.axesMg = new Axes(this.vertices)
        this.area = this.vertices.area()
        this.mass = this.density * this.area
        this.vertices.fixOrigin()
        this.inertia = this.vertices.inertia(this.mass) * 4
        this.vertices.translate(this.pos)
        this.posPrev.set(this.pos.x, this.pos.y)
        this.bound.update(this.vertices, this.velocity)
    }

    addPart(part: RigidBase) {
        this.parts.push(part)
    }

    setStatis() {
        this.isStatic = true
        this.restitution = 1
        this.friction = 1
        this.mass = this.inertia = this.density = Infinity
        this.posPrev = this.pos
        this.anglePrev = this.angle
        this.angularVelocity = 0
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

    drawDebug(ctx: CanvasRenderingContext2D): void {
        let pos = this.pos.copy().add(this.offset)
        let bw = this.bound.max.x - this.bound.min.x
        let bh = this.bound.max.y - this.bound.min.y
        ctx.save()
        ctx.strokeStyle = "#a9a9a9"
        ctx.translate(pos.x, pos.y)
        ctx.beginPath()
        ctx.strokeRect(-bw / 2, -bh / 2, bw, bh)
        ctx.closePath()
        ctx.translate(-pos.x, -pos.y)
        ctx.restore()
    }

    update(delta: number, timeScale: number, correction: number): void {
        if (this.isStatic) return
        let deltaTimeSquared = Math.pow(delta * timeScale * this.timeScale, 2)

        // from the previous step     global timeScale   self timeScale
        let frictionAir = 1 - this.frictionAir * timeScale * this.timeScale
        let velocityPrev = this.pos.copy().sub(this.posPrev)
        // update velocity with Verlet integration
        velocityPrev
            .multi(frictionAir * correction)
            .add(this.force.copy().multi(this.invMass * deltaTimeSquared))
        this.velocity.x = velocityPrev.x
        this.velocity.y = velocityPrev.y
        this.posPrev.set(this.pos.x, this.pos.y)
        this.pos.add(this.velocity)

        this.angularVelocity =
            (this.angle - (this.anglePrev ?? this.angle)) * frictionAir * correction +
            this.torque * this.invInertia * deltaTimeSquared
        this.anglePrev = this.angle
        this.angle += this.angularVelocity

        // track speed and acceleration
        this.speed = this.velocity.length()
        this.angularSpeed = Math.abs(this.angularVelocity)

        for (var i = 0; i < this.parts.length; i++) {
            const part = this.parts[i]
            part.vertices.translate(this.velocity)
            if (i > 0) {
                part.pos.add(this.velocity)
            }
            part.vertices.rotate(this.angularVelocity, this.pos)
            part.axesMg.rotate(this.angularVelocity)
            if (i > 0) {
                part.pos.rotateAbout(this.angularVelocity, this.pos)
            }
            part.bound.update(this.vertices, this.velocity)
        }
    }
}
