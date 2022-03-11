import { Vector2 } from "./data/Vector2"

export interface IOptions {
    enableCollide: boolean
    enableGravity: boolean
    gravity: Vector2
    gravityScale: number
    speedScale: number
    torqueScale: number
}
export class GameOption implements IOptions {
    enableCollide: boolean = false
    enableGravity: boolean = false
    gravity: Vector2 = Vector2.new(0, 1)
    gravityScale: number = 0.001
    speedScale: number = 0.001
    torqueScale: number = 0.1
    public static defaultOption(): IOptions {
        return new GameOption()
    }
    public static createOption(config: Partial<IOptions>):IOptions {
        let opt = GameOption.defaultOption()
        return Object.assign(opt, config)
    }
}
