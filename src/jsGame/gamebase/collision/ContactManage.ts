import { Contact, createContact } from "./Contact"
import { CollisionInfo } from "./CollisionInfo"
import { GetContactId, RigidBase } from "../rigid/RigidComponent"
import { Vector2 } from "../data/Vector2"
import { GameObject } from "../objects/GameObject"
import { clamp } from "../../../utils/helper"

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

    Update(collisions: CollisionInfo[], timestamp: number): void {
        for (const c of this.contacts) {
            c.confirmActive = false
        }
        for (let i = 0; i < collisions.length; i++) {
            const coll = collisions[i]
            let id = GetContactId(coll.bodyA, coll.bodyB)
            let contact = this.contactMap.get(id)
            if (contact === undefined) {
                let contact = createContact(coll, timestamp)
                contact.update(coll, timestamp)
                this.contacts.push(contact)
                this.contactMap.set(contact.id, contact)
            } else {
                contact.update(coll, timestamp)
                contact.confirmActive = true
            }
        }
    }
    removeOld(timestamp: number) {
        let removeIndex: number[] = []
        for (let i = 0; i < this.contacts.length; i++) {
            let c = this.contacts[i]
            if (c.confirmActive) continue
            let coll = c.collision
            if (coll.bodyA.isSleeping || coll.bodyB.isSleeping) {
                c.timeUpdated = timestamp
                continue
            }
            if (timestamp - c.timeUpdated > 1e7) {
                removeIndex.push(i)
            }
        }
        let fixedIndex = 0
        for (let i = 0; i < removeIndex.length; i++) {
            fixedIndex = removeIndex[i] - i
            let c = this.contacts[fixedIndex]
            this.contacts.splice(i, 1)
            this.contactMap.delete(c.id)
        }
    }
    preSolve(): void {
        for (const c of this.contacts) {
            if (!c.isActive) continue
            c.collision.parentA.totalRelates += c.activeRelates.length
            c.collision.parentB.totalRelates += c.activeRelates.length
        }
    }
    solve(): void {
        let positionDampen: number = 0.9
        for (const c of this.contacts) {
            if (!c.isActive) continue
            let collision = c.collision
            let bodyA = collision.parentA
            let bodyB = collision.parentB
            let normal = collision.normal
            let bodyBtoA = bodyB.positionImpulse
                .copy()
                .add(collision.penetration)
                .sub(bodyA.positionImpulse)
            c.separation = bodyBtoA.dot(normal)
        }
        for (const c of this.contacts) {
            let collision = c.collision
            let bodyA = collision.parentA
            let bodyB = collision.parentB
            let normal = collision.normal
            let positionImpulse = c.separation - c.slop
            //
            if (bodyA.isStatic || bodyB.isStatic) positionImpulse *= 2

            if (!(bodyA.isStatic || bodyA.isSleeping)) {
                let shared = positionDampen / bodyA.totalRelates
                let delta = normal.copy().multi(positionImpulse * shared)
                bodyA.positionImpulse.add(delta)
            }
            if (!(bodyB.isStatic || bodyB.isSleeping)) {
                let shared = positionDampen / bodyA.totalRelates
                let delta = normal.copy().multi(positionImpulse * shared)
                bodyB.positionImpulse.sub(delta)
            }
        }
    }

    postSolve(objects: RigidBase[]): void {
        for (const body of objects) {
            let positionImpulse = body.positionImpulse
            let velocity = body.velocity
            body.totalRelates = 0
            if (Math.sign(positionImpulse.x) !== 0 || Math.sign(positionImpulse.y) !== 0) {
                for (const part of body.parts) {
                    part.vertices.translate(positionImpulse)
                    body.bound.update(part.vertices, velocity)
                    part.pos.add(positionImpulse)
                }
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
            let relates = c.activeRelates
            let collision = c.collision
            let bodyA = collision.bodyA
            let bodyB = collision.bodyB
            let normal = collision.normal
            let tangent = collision.tangent
            for (const relate of relates) {
                let relateVertex = relate.vertex
                let normalImpulse = relate.normalImpulse
                let tangentImpulse = relate.tangentImpulse

                if (Math.sign(normalImpulse) !== 0 || Math.sign(tangentImpulse) !== 0) {
                    let impulseVec = normal
                        .copy()
                        .multi(normalImpulse)
                        .add(tangent.copy().multi(tangentImpulse))
                    if (!(bodyA.isStatic || bodyA.isSleeping)) {
                        let offset = relateVertex.sub(bodyA.pos)
                        bodyA.posPrev!.add(impulseVec.copy().multi(bodyA.invMass))
                        bodyA.anglePrev! += bodyA.invInertia * offset.cross(impulseVec)
                    }
                    if (!(bodyB.isStatic || bodyB.isSleeping)) {
                        let offset = relateVertex.sub(bodyB.pos)
                        bodyB.posPrev!.sub(impulseVec.copy().multi(bodyB.invMass))
                        bodyB.anglePrev! += bodyB.invInertia * offset.cross(impulseVec)
                    }
                }
            }
        }
    }
    solveVelocity() {
        let timeScaleSquared = 1
        for (const c of this.contacts) {
            if (!c.isActive) continue
            let collision = c.collision,
                bodyA = collision.parentA,
                bodyB = collision.parentB,
                normal = collision.normal,
                tangent = collision.tangent,
                relates = c.activeRelates,
                relatesLength = relates.length,
                shared = 1 / relatesLength,
                inverseMassTotal = bodyA.invMass + bodyB.invMass,
                friction = c.friction * c.frictionStatic * _frictionNormalMultiplier

            // update body velocities
            bodyA.velocity = bodyA.pos.copy().sub(bodyA.posPrev!)
            bodyB.velocity = bodyB.pos.copy().sub(bodyB.posPrev!)
            bodyA.angularVelocity = bodyA.angle - bodyA.anglePrev!
            bodyB.angularVelocity = bodyB.angle - bodyB.anglePrev!
            for (const rel of relates) {
                let relVertex = rel.vertex
                //
                let rA = relVertex.point.copy().sub(bodyA.pos)
                let rB = relVertex.point.copy().sub(bodyB.pos)
                //
                let velocityPointA = bodyA.velocity.add(
                    rA.copy().normal().multi(bodyA.angularVelocity)
                )
                let velocityPointB = bodyB.velocity.add(
                    rB.copy().normal().multi(bodyB.angularVelocity)
                )
                //
                let relativeVelocity = velocityPointA.copy().sub(velocityPointB)
                //
                let normalVelocity = normal.copy().dot(relativeVelocity)
                //
                let tangentVelocity = tangent.copy().dot(relativeVelocity)
                let tangentSpeed = Math.abs(tangentVelocity)
                let tangentVelocityDirection = Math.sign(tangentVelocity)
                // raw impulses
                let normalImpulse = (1 + c.restitution) * normalVelocity
                let normalForce = clamp(c.separation + normalVelocity, 0, 1)
                //
                let tangentImpulse = tangentVelocity
                let maxFriction = Number.MAX_VALUE
                // 摩擦力
                let frictionLimit = normalForce * friction * timeScaleSquared
                if (tangentSpeed > frictionLimit) {
                    maxFriction = tangentSpeed
                    tangentImpulse = clamp(
                        c.friction * tangentVelocityDirection * timeScaleSquared,
                        -maxFriction,
                        maxFriction
                    )
                }
                // 计算有效质量
                let oAcN = rA.cross(normal)
                let oBcN = rB.cross(normal)
                let kNormal =
                    inverseMassTotal +
                    bodyA.invInertia * oAcN * oAcN +
                    bodyB.invInertia * oBcN * oBcN
                let effectiveMassNormal = (kNormal == 0 ? 0 : 1) / kNormal
                let share = shared / kNormal

                normalImpulse *= share
                tangentImpulse *= share
                // handle high velocity and resting collisions separately
                if (
                    normalVelocity * normalVelocity > _restingThresh * timeScaleSquared &&
                    normalVelocity < 0
                ) {
                    // high normal velocity so clear cached contact normal impulse
                    rel.normalImpulse = 0
                } else {
                    // solve resting collision constraints using Erin Catto's method (GDC08)
                    // impulse constraint tends to 0
                    let contactNormalImpulse = rel.normalImpulse
                    rel.normalImpulse = Math.min(rel.normalImpulse + normalImpulse, 0)
                    normalImpulse = rel.normalImpulse - contactNormalImpulse
                }

                // handle high velocity and resting collisions separately
                if (tangentVelocity * tangentVelocity > _restingThreshTangent * timeScaleSquared) {
                    // high tangent velocity so clear cached contact tangent impulse
                    rel.tangentImpulse = 0
                } else {
                    // solve resting collision constraints using Erin Catto's method (GDC08)
                    // tangent impulse tends to -tangentSpeed or +tangentSpeed
                    let contactTangentImpulse = rel.tangentImpulse
                    rel.tangentImpulse = clamp(
                        rel.tangentImpulse + tangentImpulse,
                        -maxFriction,
                        maxFriction
                    )
                    tangentImpulse = rel.tangentImpulse - contactTangentImpulse
                }

                // total impulse from contact
                let impulseVec = normal
                    .copy()
                    .multi(normalImpulse)
                    .add(tangent.copy().multi(tangentImpulse))

                // apply impulse from contact
                if (!(bodyA.isStatic || bodyA.isSleeping)) {
                    bodyA.posPrev!.add(impulseVec.copy().multi(bodyA.invMass))
                    bodyA.anglePrev! += rA.cross(impulseVec) * bodyA.invInertia
                }
                if (!(bodyB.isStatic || bodyB.isSleeping)) {
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
