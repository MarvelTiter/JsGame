import { Vector2 } from "./data/Vector2"

export interface options {
    enableCollide: boolean
    enableGravity: boolean
    gravity: Vector2
    gravityScale: number
    speedScale: number
    torqueScale: number
}
export function defaultOption(): options {
    return {
        enableCollide: false,
        enableGravity: false,
        gravity: Vector2.new(0, 1),
        gravityScale: 0.001,
        speedScale: 0.001,
        torqueScale: 0.1
    }
}
export function createOption(config: Partial<options>) {
    let options = defaultOption()
    return Object.assign(options, config)
}
