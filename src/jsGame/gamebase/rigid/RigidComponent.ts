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
    // 整体旋转角度/弧度
    theta: number = 0
    // 碰撞检测的时候，与比较物体最近的点

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
        this.pos.set(this.target.pos.x, this.target.pos.y)
        this.theta = this.target.theta
        
    }
    abstract getAxis(): Vector2[]
    abstract getClosestPoint(rigid: RigidBase): Contact
    drawDebug(ctx: CanvasRenderingContext2D): void {}
}
