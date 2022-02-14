import { Vector2 } from "../data/Vector2"
import { GameObject } from "../objects/GameObject"

const gravity = 10
type ShapeType = "Circle" | "Rect" | "Triangle"
export class RigidBase {
    mass: number
    invMass: number
    force: Vector2 = new Vector2()
    pos: Vector2 = new Vector2()
    type: ShapeType
    target!: GameObject
    theta: number = 0
    // 碰撞检测的时候，与比较物体最近的点
    closestPoints: Vector2[]

    constructor(type: ShapeType, mass?: number) {
        this.type = type
        this.mass = mass ?? 0
        if (this.mass === 0) {
            this.invMass = 0
        } else {
            this.invMass = 1 / this.mass
        }
        this.closestPoints = []
    }
    bind(obj: GameObject) {
        this.target = obj
    }
    update(): void {
        this.pos.set(this.target.pos.x, this.target.pos.y)
        this.theta = this.target.theta
    }
    getClosestPoint(rigid: RigidBase): void {}
    drawDebug(ctx: CanvasRenderingContext2D): void {}
}
