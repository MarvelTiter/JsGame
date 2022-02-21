import { Contact, createContact } from "./Contact"
import { CollisionInfo } from "./CollisionInfo"
import { RigidBase } from "../rigid/RigidComponent"
import { Vector2 } from "../data/Vector2"
import { GameObject } from "../objects/GameObject"

export class ContactManage {
    private contacts: Contact[]
    private contactMap: Map<string, Contact>
    constructor() {
        this.contacts = []
        this.contactMap = new Map<string, Contact>()
    }
    get list(): Contact[] {
        return this.contacts
    }
    getContact(id: string): Contact | undefined {
        return this.contactMap.get(id)
    }

    Update(collisions: CollisionInfo[]): void {
        for (const c of this.contacts) {
            c.confirmActive = false
        }
        for (let i = 0; i < collisions.length; i++) {
            const coll = collisions[i]
            let contact = coll.contact
            if (contact === undefined) {
                let contact = createContact(coll)
                contact.update(coll)
                this.contacts.push(contact)
                this.contactMap.set(contact.id, contact)
            } else {
                contact.update(coll)
                contact.confirmActive = true
            }
        }
        let removeIndex = []
        for (let i = 0; i < this.contacts.length; i++) {
            const contact = this.contacts[i]
            if (!contact.confirmActive) {
                removeIndex.push(i)
                this.contactMap.delete(contact.id)
            }
        }
        removeIndex.forEach(i => this.contacts.splice(i, 1))
    }
    preSolve(): void {
        let ac = 0
        for (const c of this.contacts) {
            if (!c.isActive) continue
            ac = c.activeRelates.length
            c.collision.parentA.totalRelates += ac
            c.collision.parentB.totalRelates += ac
        }
    }
    solve(): void {
        let collision: CollisionInfo,
            bodyA: RigidBase,
            bodyB: RigidBase,
            normal: Vector2,
            shared: number,
            positionImpulse: number,
            delta: Vector2,
            positionDampen: number = 0.9
        for (const c of this.contacts) {
            if (!c.isActive) continue
            collision = c.collision
            bodyA = collision.parentA
            bodyB = collision.parentB
            normal = collision.normal
            let n = bodyB.positionImpulse.copy().add(collision.penetration).sub(bodyA.positionImpulse)
            c.separation = n.dot(normal)
            positionImpulse = c.separation - c.slop
            //
            shared = positionDampen / bodyA.totalRelates
            delta = normal.copy().multi(positionImpulse * shared)
            if (!bodyA.isStatis) bodyA.positionImpulse.add(delta)
            if (!bodyB.isStatis) bodyB.positionImpulse.sub(delta)
        }
    }

    postSolve(objects: RigidBase[]): void {
        for (const body of objects) {
            // let body = obj.getComponent()
            // console.log(body)
            let positionImpulse = body.positionImpulse,
                { x: positionImpulseX, y: positionImpulseY } = positionImpulse,
                velocity = body.velocity
            body.totalRelates = 0
            if (positionImpulseX !== 0 || positionImpulseY !== 0) {
                // body.angle = Math.atan2(positionImpulse.x, positionImpulse.y) * 0.01
                body.pos.add(positionImpulse)
                body.posPrev?.add(positionImpulse)
                if (positionImpulse.copy().dot(velocity) < 0) {
                    positionImpulse.set(0, 0)
                } else {
                    // positionWarming
                    positionImpulse.multi(0.8)
                }
            }
        }
    }
    preSolveVelocity() {
        for (const c of this.contacts) {
            if (!c.isActive) continue
            let relates = c.activeRelates,
                collision = c.collision,
                bodyA = collision.bodyA,
                bodyB = collision.bodyB,
                normal = collision.normal,
                tangent = collision.tangent
            for (const relate of relates) {
                let relateVertex = relate.vertex,
                    normalImpulse = relate.normalImpulse,
                    tangentImpulse = relate.tangentImpulse

                if (normalImpulse !== 0 || tangentImpulse !== 0) {
                    let impulseVec = normal.copy().multi(normalImpulse).add(tangent.copy().multi(tangentImpulse))
                    if (!bodyA.isStatis) {
                        bodyA.posPrev!.add(impulseVec.copy().multi(bodyA.invMass))
                        bodyA.anglePrev! += bodyA.invInertia * relateVertex.point.copy().sub(bodyA.pos).cross(impulseVec)
                    }
                    if (!bodyB.isStatis) {
                        bodyB.posPrev!.sub(impulseVec.copy().multi(bodyB.invMass))
                        bodyB.anglePrev! += bodyB.invInertia * relateVertex.point.copy().sub(bodyB.pos).cross(impulseVec)
                    }
                }
            }
        }
    }
    solveVelocity() {
        let maxFriction: number = 0
        let tangentImpulse: number = 0
        for (const c of this.contacts) {
            if (!c.isActive) continue
            let collision = c.collision,
                bodyA = collision.parentA,
                bodyB = collision.parentB,
                bodyAVelocity = bodyA.velocity,
                bodyBVelocity = bodyB.velocity,
                normal = collision.normal,
                tangent = collision.tangent,
                relates = c.activeRelates,
                relatesLength = relates.length,
                shared = 1 / relatesLength,
                inverseMassTotal = bodyA.invMass + bodyB.invMass,
                friction = c.friction * c.frictionStatic * _frictionNormalMultiplier

            // update body velocities
            bodyAVelocity = bodyA.pos.copy().sub(bodyA.posPrev!)
            bodyBVelocity = bodyB.pos.copy().sub(bodyB.posPrev!)
            bodyA.angularVelocity = bodyA.angle - bodyA.anglePrev!
            bodyB.angularVelocity = bodyB.angle - bodyB.anglePrev!
            for (const rel of relates) {
                let relVertex = rel.vertex
                //
                let rA = relVertex.point.copy().sub(bodyA.pos),
                    rB = relVertex.point.copy().sub(bodyB.pos)
                //
                let velocityPointAX = bodyAVelocity.x - rA.y * bodyA.angularVelocity,
                    velocityPointAY = bodyAVelocity.y + rA.x * bodyA.angularVelocity,
                    velocityPointBX = bodyBVelocity.x - rB.y * bodyB.angularVelocity,
                    velocityPointBY = bodyBVelocity.y + rB.x * bodyB.angularVelocity
                //
                let relativeVelocityX = velocityPointAX - velocityPointBX,
                    relativeVelocityY = velocityPointAY - velocityPointBY
                //
                let normalVelocity = normal.x * relativeVelocityX + normal.y * relativeVelocityY,
                    tangentVelocity = tangent.x * relativeVelocityX + tangent.y * relativeVelocityY

                let normalOverlap = c.separation + normalVelocity
                let normalForce = Math.min(normalOverlap, 1)
                normalForce = normalForce < 0 ? 0 : normalForce

                // 摩擦力
                let frictionLimit = normalForce * friction
                if (Math.abs(tangentVelocity) > frictionLimit) {
                    maxFriction = Math.abs(tangentVelocity)
                    tangentImpulse = c.friction * (tangentVelocity > 0 ? 1 : -1)
                    if (tangentImpulse < -maxFriction) {
                        tangentImpulse = -maxFriction
                    } else if (tangentImpulse > maxFriction) {
                        tangentImpulse = maxFriction
                    }
                } else {
                    tangentImpulse = tangentVelocity
                    maxFriction = Number.MAX_VALUE
                }
                // 计算有效质量
                let oAcN = rA.cross(normal),
                    oBcN = rB.cross(normal),
                    share = shared / (inverseMassTotal + bodyA.invInertia * oAcN * oAcN + bodyB.invInertia * oBcN * oBcN)

                // raw impulses
                let normalImpulse = (1 + c.restitution) * normalVelocity * share

                tangentImpulse *= share
                // handle high velocity and resting collisions separately
                if (normalVelocity * normalVelocity > _restingThresh && normalVelocity < 0) {
                    // high normal velocity so clear cached contact normal impulse
                    rel.normalImpulse = 0
                } else {
                    // solve resting collision constraints using Erin Catto's method (GDC08)
                    // impulse constraint tends to 0
                    var contactNormalImpulse = rel.normalImpulse
                    rel.normalImpulse += normalImpulse
                    rel.normalImpulse = Math.min(rel.normalImpulse, 0)
                    normalImpulse = rel.normalImpulse - contactNormalImpulse
                }

                // handle high velocity and resting collisions separately
                if (tangentVelocity * tangentVelocity > _restingThreshTangent) {
                    // high tangent velocity so clear cached contact tangent impulse
                    rel.tangentImpulse = 0
                } else {
                    // solve resting collision constraints using Erin Catto's method (GDC08)
                    // tangent impulse tends to -tangentSpeed or +tangentSpeed
                    var contactTangentImpulse = rel.tangentImpulse
                    rel.tangentImpulse += tangentImpulse
                    if (rel.tangentImpulse < -maxFriction) rel.tangentImpulse = -maxFriction
                    if (rel.tangentImpulse > maxFriction) rel.tangentImpulse = maxFriction
                    tangentImpulse = rel.tangentImpulse - contactTangentImpulse
                }

                // total impulse from contact
                let impulseVec = normal.copy().multi(normalImpulse).add(tangent.copy().multi(tangentImpulse))

                // apply impulse from contact
                if (!bodyA.isStatis) {
                    bodyA.posPrev!.add(impulseVec.copy().multi(bodyA.invMass))
                    bodyA.anglePrev! += rA.cross(impulseVec) * bodyA.invInertia
                }
                if (!bodyB.isStatis) {
                    bodyB.posPrev!.sub(impulseVec.copy().multi(bodyB.invMass))
                    bodyB.anglePrev! -= rB.cross(impulseVec) * bodyB.invInertia
                }
            }
        }
    }
}
const _restingThresh: number = 4
const _frictionNormalMultiplier: number = 5
const _restingThreshTangent: number = 6
