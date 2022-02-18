import { Vector2 } from "./Vector2"

export interface AxisInfo {
    axis: Vector2
    points: {
        start: Vector2
        end: Vector2
        offset?: number
    }
}
