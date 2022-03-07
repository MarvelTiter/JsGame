import { Vector2 } from "../data/Vector2"
import { ISolveCollide } from "./ISolveCollide"

export interface IHp extends ISolveCollide {
    max: number
    remain: number
    barWidth: number
    barHeight: number
    getPos(): Vector2
}
