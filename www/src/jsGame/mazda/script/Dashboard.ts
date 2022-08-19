import { BaseSence } from "../../gamebase/BaseSence";
import { Vector2 } from "../../gamebase/data/Vector2";
import { Game } from "../../gamebase/Game";
import { GameObject } from "../../gamebase/objects/GameObject";
import { CanvasContext } from "../../gamebase/types/DefineType";

export class Dashboard extends GameObject {

    startAngle: number
    endAngle: number
    constructor(pos: Vector2, radius: number, startAngle: number, endAngle: number, game: Game, sence: BaseSence) {
        super(game, sence);
        this.pos = pos
        this.radius = radius
        this.startAngle = startAngle
        this.endAngle = endAngle
    }
    override draw(ctx: CanvasContext): void {
        // 表盘
        // 刻度
        // 文字
        // 指针

    }
}
