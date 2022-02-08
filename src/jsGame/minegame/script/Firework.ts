import { AnimaObject } from "../../gamebase/AnimaObject";
import { BaseSence } from "../../gamebase/BaseSence";
import { FrameDefinition } from "../../gamebase/FrameDefinition";
import { Game } from "../../gamebase/Game";

export class Firework extends AnimaObject {
    constructor(game: Game, sence: BaseSence, name: string) {
        let frames: FrameDefinition[] = [];
        for (let index = 0; index < 10; index++) {
            frames.push({
                x: index * 95,
                y: 0,
                w: 95,
                h: 95,
            });
        }
        super(game, sence, name, frames)
        this.w = 95
        this.h = 95
        this.x = (this.game.getWidth() - this.w) / 2
        this.y = (this.game.getHeight() - this.h) / 2
    }
    update(): void {
        super.update()
        if (this.playTimes === 2) {
            this.sence.removeElement(this)
        }
    }
}
