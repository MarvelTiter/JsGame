import { readonly } from "vue"
import { Vector2, Vertex } from "../data/Vector2"
import { GameObject } from "../objects/GameObject"
import { GetContactId, RigidBase } from "../rigid/RigidBase"
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
    setActive(active: boolean, timestamp: number): void
}

export class ContactInstance implements Contact {
    id: string
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
    setActive(active: boolean, timestamp: number): void {
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

        coll.contact = this
        this.collision = coll
        this.timeUpdated = timestamp
        this.inverseMass = parentA.invMass + parentB.invMass
        this.friction = Math.min(parentA.friction, parentB.friction)
        this.frictionStatic = Math.max(parentA.frictionStatic, parentB.frictionStatic)
        this.slop = Math.min(parentA.slop, parentB.slop)
        this.restitution = Math.max(parentA.restitution, parentB.restitution)

        this.activeRelates.splice(0)
        if (coll.collided) {
            for (const vertex of supports) {
                let id = getId(vertex)
                let relate: Relate
                if (this.relates.has(id)) {
                    relate = this.relates.get(id)!
                } else {
                    relate = {
                        vertex: vertex,
                        normalImpulse: 0,
                        tangentImpulse: 0
                    }
                    this.relates.set(id, relate)
                }
                this.activeRelates.push(relate)
            }
            this.separation = coll.depth
            this.setActive(true, timestamp)
        } else {
            if (this.isActive) {
                this.setActive(false, timestamp)
            }
        }
        // console.log(`body ${coll.bodyA.id} and body ${coll.bodyB.id} collides ${this.collision.collided}, relates ${this.activeRelates.length}`);
    }
}

function getId(vertex: Vertex) {
    return `${vertex.belonged.id}_${vertex.index}`
}
export function createContact(coll: CollisionInfo, timestamp: number): Contact {
    return new ContactInstance(coll, timestamp)
}
