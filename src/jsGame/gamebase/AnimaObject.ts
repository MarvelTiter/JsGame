import { BaseSence } from "./BaseSence"
import { Game } from "./Game"
import { GameEntity } from "./GameEntity"
import { FrameDefinition } from "./FrameDefinition"
import { Vector2 } from "./data/Vector2"

/**
 * 动画对象
 */
export class AnimaObject extends GameEntity {
    frames!: FrameDefinition[]
    frameIndex: number = 0
    frameInterval: number = 5
    protected frameCooldown: number = 0
    protected playTimes: number = 0
    constructor(
        game: Game,
        sence: BaseSence,
        name: string
        // frames: any[]
    ) {
        super(game, sence, name)
        this.frames = this.image.frames
    }
    updateRequest(): boolean {
        return true
    }

    private calcFrameIndex(): number {
        if (this.frameIndex === this.frames.length - 1) {
            this.playTimes++
        }
        return (this.frameIndex + 1) % this.frames.length
    }

    update(): void {
        if (this.frameCooldown !== 0) {
            this.frameCooldown--
            return
        }
        this.frameIndex = this.calcFrameIndex()
        // console.log(this.frameIndex, this.frames[this.frameIndex].frame)
        this.frameCooldown = this.frameInterval
    }

    draw(ctx: CanvasRenderingContext2D): void {
        let f = this.frames[this.frameIndex].frame
        ctx.translate(this.pos.x, this.pos.y)
        ctx.drawImage(this.image.texture, f.x, f.y, f.w, f.h, -f.w / 2, -f.h / 2, f.w, f.h)
        ctx.translate(-this.pos.x, -this.pos.y)
    }
}
