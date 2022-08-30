import { BaseSence } from "../../gamebase/BaseSence";
import { Vector2 } from "../../gamebase/data/Vector2";
import { Game } from "../../gamebase/Game";
import { GameObject } from "../../gamebase/objects/GameObject";
import { CanvasContext } from "../../gamebase/types/DefineType";
import { Label } from "./dashboardComponents/Label";
import { Needle } from "./dashboardComponents/Needle";
import { Panel } from "./dashboardComponents/Panel";
import { Tick } from "./dashboardComponents/Tick";

export type ConfigureAction<T> = (p: T) => void

export class Dashboard extends GameObject {
    panels: Panel[]
    ticks: Tick[]
    labels: Label[]
    needle?: Needle
    constructor(pos: Vector2, radius: number, game: Game, sence: BaseSence) {
        super(game, sence);
        this.pos = pos
        this.radius = radius
        this.panels = []
        this.ticks = []
        this.labels = []
    }

    public ConfigurePanel(action: ConfigureAction<Panel>): Dashboard {
        const p = new Panel(this.pos, this.radius)
        action(p)
        this.panels.push(p)
        return this
    }

    public ConfigureTick(action: ConfigureAction<Tick>): Dashboard {
        const t = new Tick(this.pos, this.radius)
        action(t)
        this.ticks.push(t)
        return this
    }

    public ConfigureLabel(action: ConfigureAction<Label>): Dashboard {
        const l = new Label(this.pos, this.radius)
        action(l)
        this.labels.push(l)
        return this
    }

    public ConfigureNeedle(action: ConfigureAction<Needle>): Dashboard {
        const n = new Needle(this.pos, this.radius)
        action(n)
        this.needle = n
        return this
    }


    updateValue(v: number) {
        if (this.needle)
            this.needle.value = v
    }

    override draw(ctx: CanvasContext): void {
        const context = ctx.game
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, 5, 0, Math.PI * 2)
        context.closePath()
        context.fill()
        // 表盘
        for (const p of this.panels) {
            p.draw(context)
        }
        // 刻度
        for (const t of this.ticks) {
            t.draw(context)
        }
        // 文字
        for (const l of this.labels) {
            l.draw(context)
        }
        // 指针
        this.needle?.draw(context)
    }
}
