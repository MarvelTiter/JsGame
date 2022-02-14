import { BaseSence } from "../BaseSence"
import { Game } from "../Game"
import { FrameDefinition } from "../FrameDefinition"
import { GameObject } from "../objects/GameObject"
import { GameImage } from "../Source"
import { GameEntity } from "./GameEntity"
import { Size } from "../data/Size"

/**
 * 动画对象
 */
export class AnimaObject extends GameEntity {
    frames!: FrameDefinition[]
    frameIndex: number = 0
    frameInterval: number = 5
    protected frameCooldown: number = 0
    protected playTimes: number = 0
    private currentFrame!: FrameDefinition
    constructor(game: Game, sence: BaseSence, name: string) {
        super(game, sence, name)
        // this.image = this.game.getTextureByName(name)
        this.frames = this.image.frames
        console.log(this.image)
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
        this.frameCooldown = this.frameInterval
        this.currentFrame = this.frames[this.frameIndex]
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.currentFrame === undefined) return
        let f = this.currentFrame.frame
        ctx.translate(this.pos.x, this.pos.y)
        ctx.drawImage(this.image.texture, f.x, f.y, f.w, f.h, -f.w / 2, -f.h / 2, f.w, f.h)
        ctx.translate(-this.pos.x, -this.pos.y)
    }
}
