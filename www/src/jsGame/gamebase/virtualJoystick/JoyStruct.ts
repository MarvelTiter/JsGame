import { Vector2 } from "../data/Vector2";
import { JoyType } from "./JoystickDefType"
export interface JoyStruct {
    type: JoyType
    x: number
    y: number
    events: {
        onLeft?: () => void
        onTop?: () => void
        onRight?: () => void
        onDown?: () => void
        onChange?: (direction: Vector2, scale: number) => void
        onButtonA?: () => void
        onButtonB?: () => void
        onButtonX?: () => void
        onButtonY?: () => void
    }
}
