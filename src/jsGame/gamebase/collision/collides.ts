import { Vector2, Vertex } from "../data/Vector2"
import { CollisionInfo, createCollision } from "./CollisionInfo"
import { GetContactId, RigidBase } from "../rigid/RigidComponent"
import { calcProjectionAxes } from "../rigid/Sat"
import { ContactManage } from "./ContactManage"

export function collides(
    cmg: ContactManage,
    rigidA: RigidBase,
    rigidB: RigidBase
): CollisionInfo | undefined {
    // 分别以两个图形的投影轴进行检测
    let contact = cmg.getContact(GetContactId(rigidA, rigidB))
    let _overlapAB = calcProjectionAxes(rigidA.vertexs, rigidB.vertexs, rigidA.axes)
    if (_overlapAB.depth <= 0) {
        if (contact !== undefined) {
            contact.collision.collided = false
            contact.collision.supports.length = 0
        }
        return undefined
    }
    let _overlapBA = calcProjectionAxes(rigidB.vertexs, rigidA.vertexs, rigidB.axes)
    if (_overlapBA.depth <= 0) {
        if (contact !== undefined) {
            contact.collision.collided = false
            contact.collision.supports.length = 0
        }
        return undefined
    }
    // 两个图形有重叠部分
    let minOverlap

    if (_overlapAB.depth < _overlapBA.depth) {
        minOverlap = _overlapAB
    } else {
        minOverlap = _overlapBA
    }

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
    collision.normal = minOverlap.axis!
    collision.depth = minOverlap.depth
    let bodyA = collision.bodyA,
        bodyB = collision.bodyB
    // 修正检测轴模向量的方向
    let delta = bodyB.pos.copy().sub(bodyA.pos)
    if (delta.dot(collision.normal) > 0) {
        collision.normal.multi(-1)
    }

    let normal = collision.normal
    let supports = collision.supports
    collision.tangent.set(-normal.y, normal.x)
    collision.penetration = normal.copy().multi(collision.depth)
    let supportsB = findSupports(bodyA, bodyB, collision.normal, 1),
        supportCount = 0
    if (bodyA.vertices.contains(supportsB[0].point)) {
        supports[supportCount++] = supportsB[0]
    }
    if (bodyA.vertices.contains(supportsB[1].point)) {
        supports[supportCount++] = supportsB[1]
    }

    if (supportCount < 2) {
        let supportsA = findSupports(bodyB, bodyA, collision.normal, -1)

        if (bodyB.vertices.contains(supportsA[0].point)) {
            supports[supportCount++] = supportsA[0]
        }

        if (supportCount < 2 && bodyB.vertices.contains(supportsA[1].point)) {
            supports[supportCount++] = supportsA[1]
        }
    }
    if (supportCount === 0) {
        supports[supportCount++] = supportsB[0]
    }
    supports.length = supportCount
    return collision
}

function findSupports(bodyA: RigidBase, bodyB: RigidBase, normal: Vector2, direction: number) {
    let vertices = bodyB.vertexs
    let vertexToBody = new Vector2()
    let bodyAPosition = bodyA.pos
    let fixNormal = normal.copy().multi(direction)
    let nearestDistance = Number.MAX_VALUE
    let vertexA = vertices[0]
    let distance = 0
    let _supports: Vertex[] = new Array<Vertex>(2)

    // find deepest vertex relative to the axis
    for (const ver of vertices) {
        vertexToBody = ver.point.copy().sub(bodyAPosition)
        distance = -fixNormal.dot(vertexToBody)
        if (distance >= nearestDistance) continue
        nearestDistance = distance
        vertexA = ver
    }
    let index = vertexA.index
    let prevIndex = index - 1 >= 0 ? index - 1 : vertices.length - 1
    let vertex = vertices[prevIndex]
    vertexToBody = vertex.point.copy().sub(bodyAPosition)
    nearestDistance = -normal.dot(vertexToBody)
    let vertexB = vertex
    let nextIndex = (index + 1) % vertices.length
    vertex = vertices[nextIndex]
    vertexToBody = vertex.point.copy().sub(bodyAPosition)
    distance = -normal.dot(vertexToBody)
    if (distance < nearestDistance) {
        vertexB = vertex
    }

    _supports[0] = vertexA
    _supports[1] = vertexB

    return _supports
}
