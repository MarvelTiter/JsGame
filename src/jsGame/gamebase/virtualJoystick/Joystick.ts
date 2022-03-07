import { BaseSence } from "../BaseSence"
import { IRect } from "../data/Rect"
import { Vector2 } from "../data/Vector2"
import { Game } from "../Game"
import { MouseArgs } from "../MouseArgs"
import { GameObject } from "../objects/GameObject"
import { JoystickPart } from "./JoystickPart"
import { JoystickRocker } from "./JoystickRocker"
import { JoystickButtons } from "./JoystickButtons"
import { JoystickSetting } from "./JoystickSetting"

export class Joystick extends GameObject {
    window: IRect
    leftPos: Vector2 = new Vector2()
    rightPos: Vector2 = new Vector2()
    parts: JoystickPart[]
    constructor(game: Game, sence: BaseSence, options: JoystickSetting) {
        super(game, sence)
        this.window = sence.getWindowSize()
        this.parts = []
        if (options.Left !== undefined) {
            for (const l of options.Left) {
                let temp
                if (l.type === "Stick") {
                    temp = new JoystickRocker(l.x, l.y, "LEFT")
                } else {
                    temp = new JoystickButtons(l.x, l.y, "LEFT")
                }
                Object.assign(temp, l.events)
                this.parts.push(temp)
            }
        }
        if (options.Right !== undefined) {
            for (const l of options.Right) {
                let temp
                if (l.type === "Stick") {
                    temp = new JoystickRocker(l.x, l.y, "RIGHT")
                } else {
                    temp = new JoystickButtons(l.x, l.y, "RIGHT")
                }
                Object.assign(temp, l.events)
                this.parts.push(temp)
            }
        }
    }

    checkFocu(x: number, y: number): boolean {
        return this.parts.some(e => e.checkFocu(x, y))
    }

    touchLeftPos: Vector2 | undefined
    touchRightPos: Vector2 | undefined

    updateTouchPos(e: MouseArgs[]): void {
        let left = e.find(a => a.x < this.window.w / 2)
        let right = e.find(a => a.x > this.window.w / 2)
        this.parts.filter(p => p.position === "LEFT").forEach(e => e.updateTouchPos(left))
        this.parts.filter(p => p.position === "RIGHT").forEach(e => e.updateTouchPos(right))
    }

    onTouchStart(e: MouseArgs[]): void {
        this.updateTouchPos(e)
    }
    onTouchMove(e: MouseArgs[]): void {
        this.updateTouchPos(e)
    }
    onTouchEnd(e: MouseArgs[]): void {
        this.updateTouchPos(e)
    }

    draw(ctx: CanvasRenderingContext2D) {
        let offset = this.sence.getWindowPos()
        for (const p of this.parts) {
            p.draw(ctx, offset)
        }
    }
}
