import { Vector2, Vertex } from "../data/Vector2"

interface ProjectionInfo {
    min: number
    max: number
}
interface ProjectResult {
    depth: number
    axis: Vector2 | null
}
/**
 * 分离轴算法，计算凸多边形是否碰撞
 * @param rA
 * @param rB
 */
export function calcProjectionAxes(
    pointsA: Vertex[],
    pointsB: Vertex[],
    axes: Vector2[]
): ProjectResult {
    let min = Number.MAX_VALUE
    let cur!: Vector2
    for (const axis of axes) {
        let pp1 = calcProj(axis, pointsA)
        let pp2 = calcProj(axis, pointsB)
        let overlap = segDist(pp1, pp2)
        if (overlap < min) {
            min = overlap
            cur = axis
        }
        // 没有相交的部分
        if (overlap <= 0) {
            break
        }
    }

    return {
        depth: min,
        axis: cur
    }
}

function calcProj(axis: Vector2, path: Vertex[]): ProjectionInfo {
    let v: Vector2 = path[0].point
    let min: number = 0
    let max: number = 0
    let d: number = 0
    min = max = axis.dot(v) //计算投影轴与第一个坐标点的点积
    for (var i = 1; i < path.length; i++) {
        v = path[i].point
        d = axis.dot(v) //计算v到投影轴的距离,遍历出最小和最大区间
        if (d > max) {
            max = d
        } else if (d < min) {
            min = d
        }
    }

    return {
        min: min,
        max: max
    }
}
function segDist(a: ProjectionInfo, b: ProjectionInfo): number {
    let overlapAB = a.max - b.min
    let overlapBA = b.max - a.min
    return Math.min(overlapAB, overlapBA)
}
