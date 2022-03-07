import { getActualPixel } from "../../../utils/helper"

export type JoyPosition = "LEFT" | "RIGHT"
export type JoyType = "Stick" | "Button"
export type JoyEvent = "OnDown" | "OnUp" | "MoveUp" | "MoveRight" | "MoveDown" | "MoveLeft" | "ButtonA" | "ButtonB" | "ButtonX" | "ButtonY"
export const JoystickOffset = getActualPixel(20)
export const JoystickBoxRadius = getActualPixel(80)
export const JoystickBgColor = "rgba(0, 0, 0, .16)"
export const JoystickColor = "rgba(0, 0, 0, .5)"
export const JoystickRadius = getActualPixel(30)
