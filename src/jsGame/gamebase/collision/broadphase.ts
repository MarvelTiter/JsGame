import { Bound } from "../data/Bound"
import { IRect } from "../data/Rect"
import { RigidBase } from "../rigid/RigidBase"
export interface tempContact {
    bodyA: RigidBase
    bodyB: RigidBase
}
export function broadphase(
    rigids: RigidBase[],
    window: IRect,
    forceUpdate: boolean
): tempContact[] {
    if (!forceUpdate) return []
    let ret: tempContact[] = []
    for (let i = 0; i < rigids.length; i++) {
        const bodyA = rigids[i]
        let boundXMax = bodyA.bound.max.x,
            boundYMax = bodyA.bound.max.y,
            boundYMin = bodyA.bound.min.y,
            bodyAStatic = bodyA.isStatic || bodyA.isSleeping
        for (let j = i + 1; j < rigids.length; j++) {
            const bodyB = rigids[j]
            let boundsB = bodyB.bound
            if (boundsB.min.x > boundXMax) {
                continue
            }
            if (boundYMax < boundsB.min.y || boundYMin > boundsB.max.y) {
                continue
            }
            if (bodyAStatic && (bodyB.isStatic || bodyB.isSleeping)) {
                continue
            }
            // if (outOfWorldbound(bodyA, worldBound) || outOfWorldbound(bodyB, worldBound)) {
            //     continue
            // }
            ret.push({
                bodyA: bodyA,
                bodyB: bodyB
            })
        }
    }
    return ret
}
function outOfWorldbound(body: RigidBase, worldBound: Bound): boolean {
    return (
        body.bound.max.x < worldBound.min.x ||
        body.bound.min.x > worldBound.max.x ||
        body.bound.max.y < worldBound.min.y ||
        body.bound.min.y > worldBound.max.y
    )
}
