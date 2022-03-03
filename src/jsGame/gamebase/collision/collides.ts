import { Vector2, Vertex } from "../data/Vector2"
import { CollisionInfo, createCollision } from "./CollisionInfo"
import { GetContactId, RigidBase } from "../rigid/RigidComponent"
import { calcProjectionAxes } from "../rigid/Sat"
import { ContactManage } from "./ContactManage"

export function collides(cmg: ContactManage, rigidA: RigidBase, rigidB: RigidBase): CollisionInfo {
    let minOverlap
    let collision!: CollisionInfo
    let contact = cmg.getContact(GetContactId(rigidA, rigidB))
    let collisionPrev = contact?.collision
    if (collisionPrev !== undefined) {
        collision = collisionPrev
    } else {
        collision = createCollision(rigidA, rigidB)
        collision.collided = false
        // 确保 bodyA 是 id 小的，方便后面的计算
        if (rigidA.id > rigidB.id) {
            collision.bodyA = rigidB
            collision.bodyB = rigidA
        } else {
            collision.bodyA = rigidA
            collision.bodyB = rigidB
        }
    }
    // 分别以两个图形的投影轴进行检测
    let _overlapAB = calcProjectionAxes(rigidA.vertexs, rigidB.vertexs, rigidA.axes)
    if (_overlapAB.depth <= 0) {
        collision.collided = false
        return collision
    }
    let _overlapBA = calcProjectionAxes(rigidB.vertexs, rigidA.vertexs, rigidB.axes)
    if (_overlapBA.depth <= 0) {
        collision.collided = false
        return collision
    }
    // 两个图形有重叠部分
    collision.collided = true

    if (_overlapAB.depth < _overlapBA.depth) {
        minOverlap = _overlapAB
    } else {
        minOverlap = _overlapBA
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
    collision.supports.splice(0)
    let supports = collision.supports
    collision.tangent = normal.copy().normal()
    collision.penetration = normal.copy().multi(collision.depth)
    let supportsB = findSupports(bodyA, bodyB, normal, 1)
    if (bodyA.vertices.contains(supportsB[0])) {
        supports.push(supportsB[0])
    }
    if (bodyA.vertices.contains(supportsB[1])) {
        supports.push(supportsB[1])
    }

    if (supports.length < 2) {
        let supportsA = findSupports(bodyB, bodyA, normal, -1)

        if (bodyB.vertices.contains(supportsA[0])) {
            supports.push(supportsA[0])
        }

        if (supports.length < 2 && bodyB.vertices.contains(supportsA[1])) {
            supports.push(supportsA[1])
        }
    }
    if (supports.length === 0) {
        supports.push(supportsB[0])
        supports.push(supportsB[1])
    }
    collision.supports = supports
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
        vertexToBody = ver.sub(bodyAPosition)
        distance = -fixNormal.dot(vertexToBody)
        if (distance >= nearestDistance) continue
        nearestDistance = distance
        vertexA = ver
    }
    let index = vertexA.index
    let prevIndex = index - 1 >= 0 ? index - 1 : vertices.length - 1
    let vertex = vertices[prevIndex]
    vertexToBody = vertex.sub(bodyAPosition)
    nearestDistance = -fixNormal.dot(vertexToBody)
    let vertexB = vertex
    let nextIndex = (index + 1) % vertices.length
    vertex = vertices[nextIndex]
    vertexToBody = vertex.sub(bodyAPosition)
    distance = -fixNormal.dot(vertexToBody)
    if (distance < nearestDistance) {
        vertexB = vertex
    }

    _supports[0] = vertexA
    _supports[1] = vertexB

    return _supports
}
