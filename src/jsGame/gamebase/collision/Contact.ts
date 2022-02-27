import { readonly } from "vue"
import { Vector2, Vertex } from "../data/Vector2"
import { GameObject } from "../objects/GameObject"
import { GetContactId, RigidBase } from "../rigid/RigidComponent"
import { CollisionInfo } from "./CollisionInfo"

export interface Relate {
    vertex: Vertex
    normalImpulse: number
    tangentImpulse: number
}

/**
 * 记录检测碰撞的两个物体的信息
 */
export interface Contact {
    confirmActive: boolean
    id: string
    readonly bodyA: RigidBase
    readonly bodyB: RigidBase
    isActive: boolean
    collision: CollisionInfo
    relates: Map<string, Relate>
    activeRelates: Relate[]
    separation: number
    inverseMass: number
    friction: number
    frictionStatic: number
    restitution: number
    slop: number
    timeCreated: number
    timeUpdated: number
    timestamp: number
    update(coll: CollisionInfo, timestamp: number): void
}

export class ContactInstance implements Contact {
    id: string
    confirmActive: boolean = true
    isActive: boolean
    collision: CollisionInfo
    separation: number
    inverseMass: number = 0
    friction: number = 0
    frictionStatic: number = 0
    restitution: number = 0
    slop: number = 0
    timeCreated: number
    timeUpdated: number
    timestamp: number
    relates: Map<string, Relate>
    activeRelates: Relate[] = []
    get bodyA(): RigidBase {
        return this.collision.bodyA
    }
    get bodyB(): RigidBase {
        return this.collision.bodyB
    }
    constructor(coll: CollisionInfo, timestamp: number) {
        this.collision = coll
        this.isActive = true
        this.timeCreated = timestamp
        this.timeUpdated = timestamp
        this.timestamp = timestamp
        this.relates = new Map<string, Relate>()
        this.id = GetContactId(this.bodyA, this.bodyB)
        this.separation = coll.depth
    }
    setActive(active: boolean, timestamp: number) {
        if (active) {
            this.isActive = true
            this.timestamp = timestamp
        } else {
            this.isActive = false
        }
    }

    update(coll: CollisionInfo, timestamp: number): void {
        let supports = coll.supports,
            parentA = coll.parentA,
            parentB = coll.parentB

        this.collision = coll
        this.timeUpdated = timestamp
        this.inverseMass = parentA.invMass + parentB.invMass
        this.friction = parentA.friction > parentB.friction ? parentB.friction : parentA.friction
        this.frictionStatic =
            parentA.frictionStatic > parentB.frictionStatic
                ? parentA.frictionStatic
                : parentB.frictionStatic
        this.slop = parentA.slop > parentB.slop ? parentA.slop : parentB.slop
        coll.contact = this

        this.activeRelates = []
        let relates = this.relates,
            activeRelates = this.activeRelates
        if (coll.collided) {
            for (const vertex of supports) {
                let id = getId(vertex)
                let relate: Relate
                if (relates.has(id)) {
                    relate = relates.get(id)!
                } else {
                    relate = {
                        vertex: vertex,
                        normalImpulse: 0,
                        tangentImpulse: 0
                    }
                    relates.set(id, relate)
                }
                activeRelates.push(relate)
            }
            this.separation = coll.depth
            this.setActive(true, timestamp)
        } else {
            if (this.isActive) {
                this.setActive(false, timestamp)
            }
        }
    }
}

function getId(vertex: Vertex) {
    return `${vertex.belonged.id}_${vertex.index}`
}
export function createContact(coll: CollisionInfo, timestamp: number): Contact {
    return new ContactInstance(coll, timestamp)
}
