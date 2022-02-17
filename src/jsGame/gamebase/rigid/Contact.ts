import { Vector2 } from "../data/Vector2"
import { GameObject } from "../objects/GameObject"

/**
 * 记录检测碰撞的两个物体的信息
 */
export interface Contact {
    gA: GameObject
    gB: GameObject
    mPa: Vector2
    mPb: Vector2
    normal: Vector2
    distance: number
}
