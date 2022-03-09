import { BaseSence } from "../BaseSence"
import { IRect } from "../data/Rect"
import { Vector2 } from "../data/Vector2"
import { Game } from "../Game"
import { MouseArgs } from "../MouseArgs"
import { GameObject } from "../objects/GameObject"
import { JoystickPart } from "./JoystickPart"
import { JoystickRocker } from "./JoystickRocker"
import { JoystickButtons } from "./JoystickButtons"
import { JoyStruct } from "./JoyStruct"
import { CanvasContext } from "../types/DefineType"

export class Joystick extends GameObject {
    window: IRect
    parts: JoystickPart[]
    constructor(game: Game, sence: BaseSence, options: JoyStruct[]) {
        super(game, sence)
        this.window = sence.getWindowSize()
        this.parts = []
        for (const l of options) {
            let temp
            if (l.type === "Stick") {
                temp = new JoystickRocker(l.x, l.y)
            } else {
                temp = new JoystickButtons(l.x, l.y)
            }
            Object.assign(temp, l.events)
            this.parts.push(temp)
        }
    }

    checkFocu(x: number, y: number): boolean {
        return this.parts.some(e => e.checkFocu(x, y))
    }

    updateTouchPos(es: MouseArgs[]): void {
        this.parts.forEach(p => p.updateTouchPos(es))
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

    update(delta: number, timeScale: number, correction: number): void {
        for (const p of this.parts) {
            p.update()
        }
    }

    draw(context: CanvasContext) {
        for (const p of this.parts) {
            p.draw(context.ui)
        }
    }
}
