import { Vector2 } from "../data/Vector2"
import { Contact } from "./Contact"
import { RigidBase } from "./RigidComponent"

interface ProjectionInfo {
    min: number
    max: number
    minPoint: Vector2
    maxPoint: Vector2
    axis: Vector2
    axisOnSelf: boolean
}
interface ProjectResult {
    distance: number
    point1: Vector2
    point2: Vector2
}
/**
 * 分离轴算法，计算凸多边形是否碰撞
 * @param rA
 * @param rB
 */
export function getClosestPoints(rA: RigidBase, rB: RigidBase): ProjectResult {
    let axis1 = rA.getAxis()
    let axis2 = rB.getAxis()
    let dis = 0
    for (let i = 0; i < axis1.length + axis2.length; i++) {
        let axis: Vector2
        if (i < axis1.length) {
            axis = axis1[i]
        } else {
            axis = axis2[i - axis1.length]
        }
        let pp1 = calcProj(axis, rA.actualPoints, i < axis1.length)
        let pp2 = calcProj(axis, rB.actualPoints, i < axis1.length)
        let result = segDist(pp1, pp2)
        if (result.distance > 0) {
            return result
        }
    }
    return {
        distance: 0,
        point1: rA.pos,
        point2: rB.pos
    }
}

function calcProj(axis: Vector2, path: Vector2[], axisOnSelf: boolean): ProjectionInfo {
    let v: Vector2 = path[0]
    let d: number, min: number, max: number, mip: Vector2, map: Vector2
    min = max = axis.dot(v) //计算投影轴与第一个坐标点的点积
    mip = map = v
    for (var i = 1; i < path.length; i++) {
        v = path[i]
        d = axis.dot(v) //计算v到投影轴的距离,遍历出最小和最大区间
        if (d < min) {
            min = d
            mip = v
        }
        if (d > max) {
            max = d
            map = v
        }
    }
    return {
        axis: axis,
        axisOnSelf: axisOnSelf,
        min: min,
        max: max,
        minPoint: mip,
        maxPoint: map
    }
}
function segDist(p1: ProjectionInfo, p2: ProjectionInfo): ProjectResult {
    if (p2.min > p1.max) {
        let dist = p2.min - p1.max
        let d = p2.axis.copy().normalize().multi(dist)
        return {
            distance: p2.min - p1.max,
            point1: p2.minPoint,
            point2: d
        }
    } else if (p1.min > p2.max) {
        let dist = p1.min - p2.max
        let d = p1.axis.copy().normalize().multi(dist)
        return {
            distance: p1.min - p2.max,
            point1: d,
            point2: p2.maxPoint
        }
    }
    return {
        distance: 0,
        point1: new Vector2(),
        point2: new Vector2()
    }
}
