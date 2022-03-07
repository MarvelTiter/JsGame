import { Vector2 } from "../data/Vector2";
import { JoystickPart } from "./JoystickPart";
import { JoyPosition } from "./Joystick";

/**
 * 虚拟按键部件
 */
export class JoystickButtons extends JoystickPart {
    onButtonA?: () => void;
    onButtonB?: () => void;
    onButtonX?: () => void;
    onButtonY?: () => void;
    constructor(x: number, y: number, position: JoyPosition) {
        super(x, y, position, "Button");
    }
    handleTouch(): void {
        if (!this.active)
            return;
    }
    draw(ctx: CanvasRenderingContext2D, offset: Vector2): void {
        throw new Error("Method not implemented.");
    }
}
