import { Vector2, Vertex } from "../data/Vector2"
import { CollisionInfo, createCollision } from "./CollisionInfo"
import { GetContactId, RigidBase } from "../rigid/RigidComponent"
import { calcProjectionAxes } from "../rigid/Sat"
import { ContactManage } from "./ContactManage"

export function collides(cmg: ContactManage, rigidA: RigidBase, rigidB: RigidBase): CollisionInfo | undefined {
    // 分别以两个图形的投影轴进行检测
    let contact = cmg.getContact(GetContactId(rigidA, rigidB))
    let _overlapAB = calcProjectionAxes(rigidA.actualPoints, rigidB.actualPoints, rigidA.getAxes())
    if (_overlapAB.depth <= 0) {
        if (contact !== undefined) {
            contact.collision.supports = []
        }
        return undefined
    }
    let _overlapBA = calcProjectionAxes(rigidB.actualPoints, rigidA.actualPoints, rigidB.getAxes())
    if (_overlapBA.depth <= 0) {
        if (contact !== undefined) {
            contact.collision.supports = []
        }
        return undefined
    }
    // 两个图形有重叠部分
    let collision!: CollisionInfo
    if (contact === undefined) {
        collision = createCollision(rigidA, rigidB)
        collision.collided = true
        // 确保 bodyA 是 id 小的，方便后面的计算
        if (rigidA.id > rigidB.id) {
            collision.bodyA = rigidB
            collision.bodyB = rigidA
        } else {
            collision.bodyA = rigidA
            collision.bodyB = rigidB
        }
    } else {
        collision = contact.collision
    }

    let minOverlap

    if (_overlapAB.depth < _overlapBA.depth) {
        minOverlap = _overlapAB
    } else {
        minOverlap = _overlapBA
    }

    let bodyA = collision.bodyA,
        bodyB = collision.bodyB,
        normal = collision.normal,
        supports = collision.supports,
        { x: minAxisX, y: minAxisY } = minOverlap.axis!
    // 修正检测轴模向量的方向
    // let delta = bodyB.pos.copy().sub(bodyA.pos)
    // if (delta.dot(minOverlap.axis!) < 0) {
    //     collision.normal = minOverlap.axis!.copy()
    // } else {
    //     collision.normal = minOverlap.axis!.copy().multi(-1)
    // }
    if (minAxisX * (bodyB.pos.x - bodyA.pos.x) + minAxisY * (bodyB.pos.y - bodyA.pos.y) < 0) {
        normal.x = minAxisX
        normal.y = minAxisY
    } else {
        normal.x = -minAxisX
        normal.y = -minAxisY
    }
    collision.tangent.set(-normal.y, normal.x)
    collision.depth = minOverlap.depth
    collision.penetration = normal.copy().multi(collision.depth)
    let supportsB = findSupports(bodyA, bodyB, normal, 1),
        supportCount = 0
    if (bodyA.contains(supportsB[0].point)) {
        supports[supportCount++] = supportsB[0]
    }
    if (bodyA.contains(supportsB[1].point)) {
        supports[supportCount++] = supportsB[1]
    }

    if (supportCount < 2) {
        let supportsA = findSupports(bodyB, bodyA, normal, -1)

        if (bodyB.contains(supportsA[0].point)) {
            supports[supportCount++] = supportsA[0]
        }

        if (supportCount < 2 && bodyB.contains(supportsA[1].point)) {
            supports[supportCount++] = supportsA[1]
        }
    }
    if (supportCount === 0) {
        supports[supportCount++] = supportsB[0]
    }
    supports.length = supportCount
    return collision
}

/**
 * Matter.js
 * @param bodyA
 * @param bodyB
 * @param normal
 * @param direction
 * @returns
 */
function findSupports(bodyA: RigidBase, bodyB: RigidBase, normal: Vector2, direction: number) {
    let vertices = bodyB.actualPoints,
        verticesLength = vertices.length,
        bodyAPositionX = bodyA.pos.x,
        bodyAPositionY = bodyA.pos.y,
        normalX = normal.x * direction,
        normalY = normal.y * direction,
        nearestDistance = Number.MAX_VALUE,
        vertexA!: Vertex,
        vertexB!: Vertex,
        vertexC!: Vertex,
        distance,
        j
    let _supports: Vertex[] = new Array<Vertex>(2)

    // find deepest vertex relative to the axis
    for (j = 0; j < verticesLength; j += 1) {
        vertexB = vertices[j]
        distance = normalX * (bodyAPositionX - vertexB.point.x) + normalY * (bodyAPositionY - vertexB.point.y)

        // convex hill-climbing
        if (distance < nearestDistance) {
            nearestDistance = distance
            vertexA = vertexB
        }
    }

    // measure next vertex
    vertexC = vertices[(verticesLength + vertexA.index - 1) % verticesLength]
    nearestDistance = normalX * (bodyAPositionX - vertexC.point.x) + normalY * (bodyAPositionY - vertexC.point.y)

    // compare with previous vertex
    vertexB = vertices[(vertexA.index + 1) % verticesLength]
    if (normalX * (bodyAPositionX - vertexB.point.x) + normalY * (bodyAPositionY - vertexB.point.y) < nearestDistance) {
        _supports[0] = vertexA
        _supports[1] = vertexB

        return _supports
    }

    _supports[0] = vertexA
    _supports[1] = vertexC

    return _supports
}
