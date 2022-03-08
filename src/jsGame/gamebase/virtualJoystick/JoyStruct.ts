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
        onButtonA?: () => void
        onButtonB?: () => void
        onButtonX?: () => void
        onButtonY?: () => void
    }
}