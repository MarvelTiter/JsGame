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
    relates: Relate[]
    activeRelates: Relate[]
    separation: number
    inverseMass: number
    friction: number
    frictionStatic: number
    restitution: number
    slop: number
    timeCreated: number
    timeUpdated: number
    update(coll: CollisionInfo): void
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
    timeCreated: number = 0
    timeUpdated: number = 0
    relates: Relate[] = []
    activeRelates: Relate[] = []
    get bodyA(): RigidBase {
        return this.collision.bodyA
    }
    get bodyB(): RigidBase {
        return this.collision.bodyB
    }
    constructor(coll: CollisionInfo) {
        this.collision = coll
        this.isActive = true
        this.id = GetContactId(this.bodyA, this.bodyB)
        this.separation = coll.depth
    }

    update(coll: CollisionInfo): void {
        let supports = coll.supports,
            parentA = coll.parentA,
            parentB = coll.parentB,
            parentAVerticesLength = parentA.points.length

        this.isActive = true
        this.collision = coll
        this.inverseMass = parentA.invMass + parentB.invMass
        this.friction = parentA.friction > parentB.friction ? parentB.friction : parentA.friction
        this.frictionStatic = parentA.frictionStatic > parentB.frictionStatic ? parentA.frictionStatic : parentB.frictionStatic
        this.slop = parentA.slop > parentB.slop ? parentA.slop : parentB.slop
        coll.contact = this

        this.activeRelates = []
        let relates = this.relates,
            activeRelates = this.activeRelates
        for (let i = 0; i < supports.length; i++) {
            let support = supports[i],
                id = support.belonged === parentA ? support.index : parentAVerticesLength + support.index,
                relate = relates[id]
            if (!relate) {
                relate = {
                    vertex: support,
                    normalImpulse: 0,
                    tangentImpulse: 0
                }
                relates[id] = relate
            }
            activeRelates.push(relate)
        }
    }
}

export function createContact(coll: CollisionInfo): Contact {
    return new ContactInstance(coll)
}
