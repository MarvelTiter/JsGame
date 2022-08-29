import { BaseSence } from "../../gamebase/BaseSence";
import { Vector2 } from "../../gamebase/data/Vector2";
import { Game } from "../../gamebase/Game";
import { GameObject } from "../../gamebase/objects/GameObject";
import { CanvasContext } from "../../gamebase/types/DefineType";
import { Panel } from "./dashboardComponents/Panel";

export type ConfigureAction<T> = (p: T) => void

export class Dashboard extends GameObject {
    panels: Panel[]
    constructor(pos: Vector2, radius: number,  game: Game, sence: BaseSence) {
        super(game, sence);
        this.pos = pos
        this.radius = radius
        this.panels = []
    }

    public ConfigurePanel(action: ConfigureAction<Panel>): Dashboard {
        const p = new Panel(this.pos, this.radius)
        action(p)
        this.panels.push(p)
        return this
    }

    override draw(ctx: CanvasContext): void {
        // 表盘
        for (const p of this.panels) {
            p.draw(ctx.game)
        }
        // 刻度
        // 文字
        // 指针

    }
}
