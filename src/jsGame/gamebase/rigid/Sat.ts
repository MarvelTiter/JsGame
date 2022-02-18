import { AxisInfo } from "../data/AxisInfo"
import { Vector2 } from "../data/Vector2"
import { Contact } from "./Contact"
import { RigidBase } from "./RigidComponent"

interface ProjectionInfo {
    min: number
    max: number
    minPoint: Vector2
    maxPoint: Vector2
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
        let axis: AxisInfo
        if (i < axis1.length) {
            axis = axis1[i]
        } else {
            axis = axis2[i - axis1.length]
        }
        let pp1 = calcProj(axis, rA.actualPoints)
        let pp2 = calcProj(axis, rB.actualPoints)
        let result = segDist(pp1, pp2, axis)
        if (result.distance > 0) {
            // console.log("result: ", result)
            // console.log("axis: ", axis)
            // console.log("pp1 max: ", pp1.max, "pp2 max: ", pp2.max,"pp1 min: ", pp1.min, "pp2 min: ", pp2.min, "axis: ", axis)

            return result
        }
    }
    return {
        distance: 0,
        point1: rA.pos,
        point2: rB.pos
    }
}

function calcProj(axisInfo: AxisInfo, path: Vector2[]): ProjectionInfo {
    let v: Vector2 = path[0]
    let d: number, min: number, max: number, mip: Vector2, map: Vector2
    let axis = axisInfo.axis
    let pointOnAxis = checkIsOnAxis(v, axisInfo)
    min = max = axis.dot(v) //计算投影轴与第一个坐标点的点积
    mip = map = v
    for (var i = 1; i < path.length; i++) {
        v = path[i]
        d = axis.dot(v) //计算v到投影轴的距离,遍历出最小和最大区间
        pointOnAxis = checkIsOnAxis(v, axisInfo)
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
        axisOnSelf: pointOnAxis,
        min: min,
        max: max,
        minPoint: mip,
        maxPoint: map
    }
}
function segDist(p1: ProjectionInfo, p2: ProjectionInfo, axis: AxisInfo): ProjectResult {
    let frag = axis.points.end.copy().sub(axis.points.start).normalize()
    let connect: Vector2
    let point1: Vector2 = new Vector2()
    let point2: Vector2 = new Vector2()
    let dist: number = 0
    if (p2.min > p1.max) {
        dist = p2.min - p1.max
        if (!p1.axisOnSelf) {
            point1 = p1.maxPoint
        } else if (!p2.axisOnSelf) {
            point1 = p2.minPoint
        }
        connect = point1.copy().sub(axis.points.start)
        let l = connect.dot(frag)
        if (l <= 0) {
            point2 = axis.points.start
        } else if (l >= frag.length()) {
            point2 = axis.points.end
        }
        point2 = frag.copy().normalize().multi(l)
    } else if (p1.min > p2.max) {
        dist = p1.min - p2.max
        if (!p1.axisOnSelf) {
            point1 = p2.maxPoint
        } else {
            point1 = p1.minPoint
        }
        connect = point1.copy().sub(axis.points.start)
        // console.log(connect)
        let l = connect.dot(frag)
        console.log(connect, frag, l)
        if (l < 0) {
            point2 = axis.points.start
        } else if (l >= frag.length()) {
            point2 = axis.points.end
        }
        if (point2 !== undefined) point2 = point2.copy().normalize().multi(l)
    }

    return {
        distance: dist,
        point1: point1,
        point2: point2
    }
}
function checkIsOnAxis(v: Vector2, axisInfo: AxisInfo): boolean {
    let offset = axisInfo.points.offset ?? 0
    if (offset === 0) {
        return v.equal(axisInfo.points.start) || v.equal(axisInfo.points.end)
    } else {
        let vxl = v.copy()
        vxl.x = vxl.x - offset
        let vxr = v.copy()
        vxr.x = vxr.x + offset
        let vyl = v.copy()
        vyl.y = vyl.y - offset
        let vyr = v.copy()
        vyr.y = vyr.y + offset
        return (
            vxl.equal(axisInfo.points.start) ||
            vxl.equal(axisInfo.points.end) ||
            vxr.equal(axisInfo.points.start) ||
            vxr.equal(axisInfo.points.end) ||
            vyl.equal(axisInfo.points.start) ||
            vyl.equal(axisInfo.points.end) ||
            vyr.equal(axisInfo.points.start) ||
            vyr.equal(axisInfo.points.end)
        )
    }
}
