import { Vector2, Vertex } from "../data/Vector2"
import { GameObject } from "../objects/GameObject"
import { RigidBase } from "../rigid/RigidBase"
import { Contact } from "./Contact"

export interface CollisionInfo {
    contact: Contact | undefined
    collided: boolean
    bodyA: RigidBase
    bodyB: RigidBase
    readonly parentA: RigidBase
    readonly parentB: RigidBase
    targetA: GameObject
    targetB: GameObject
    normal: Vector2
    depth: number
    /**
     * 正切
     */
    tangent: Vector2
    /**
     * 在另一个物体内部
     */
    penetration: Vector2
    /**
     * 碰撞接触的点
     */
    supports: Vertex[]
}

export class CollisionInstance implements CollisionInfo {
    contact: Contact | undefined
    bodyA: RigidBase
    bodyB: RigidBase
    depth: number = 0
    collided: boolean = false
    normal: Vector2 = Vector2.new(0, 0)
    tangent: Vector2 = Vector2.new(0, 0)
    penetration: Vector2 = Vector2.new(0, 0)
    supports: Vertex[] = []
    get parentA(): RigidBase {
        return this.bodyA.parnet
    }
    get parentB(): RigidBase {
        return this.bodyB.parnet
    }
    get targetA(): GameObject {
        return this.parentA.target
    }
    get targetB(): GameObject {
        return this.parentB.target
    }

    constructor(a: RigidBase, b: RigidBase) {
        this.bodyA = a
        this.bodyB = b
        this.bodyA.parnet = a
        this.bodyB.parnet = b
    }
}

export function createCollision(a: RigidBase, b: RigidBase): CollisionInstance {
    return new CollisionInstance(a, b)
}
