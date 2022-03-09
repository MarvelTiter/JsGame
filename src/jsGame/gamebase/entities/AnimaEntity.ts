import { BaseSence } from "../BaseSence"
import { Game } from "../Game"
import { FrameDefinition } from "../FrameDefinition"
import { GameObject } from "../objects/GameObject"
import { GameImage } from "../Source"
import { GameEntity } from "./GameEntity"
import { Bound } from "../data/Bound"
import { CanvasContext } from "../types/DefineType"

/**
 * 动画对象
 */
export class AnimaEntity extends GameEntity {
    frames!: FrameDefinition[]
    frameIndex: number = 0
    frameInterval: number = 5
    protected frameCooldown: number = 0
    protected playTimes: number
    protected playedTimes: number = 0
    done?: () => void
    private currentFrame!: FrameDefinition
    constructor(game: Game, sence: BaseSence, name: string, playtimes: number = 0) {
        super(game, sence, name)
        // this.image = this.game.getTextureByName(name)
        this.frames = this.image.frames
        this.playTimes = playtimes
    }
    updateRequest(): boolean {
        return true
    }

    private calcFrameIndex(): number {
        if (this.frameIndex === this.frames.length - 1) {
            this.playedTimes++
        }
        return (this.frameIndex + 1) % this.frames.length
    }

    checkDone() {
        if (this.playTimes === 0) return false
        return this.playedTimes === this.playTimes
    }

    update(): void {
        if (this.checkDone()) {
            this.done?.call(null)
        }
        if (this.frameCooldown !== 0) {
            this.frameCooldown--
            return
        }
        this.frameIndex = this.calcFrameIndex()
        this.frameCooldown = this.frameInterval
        this.currentFrame = this.frames[this.frameIndex]
        this.updateSize()
    }

    private updateSize() {
        this.rect.w = this.currentFrame.frame.w
        this.rect.h = this.currentFrame.frame.h
        this.radius = (this.currentFrame.frame.w + this.currentFrame.frame.h) / 2
    }

    draw(context: CanvasContext): void {
        let ctx = context.game
        if (this.checkDone()) {
            return
        }
        if (this.currentFrame === undefined) return
        let f = this.currentFrame.frame
        ctx.translate(this.pos.x, this.pos.y)
        ctx.drawImage(this.image.texture, f.x, f.y, f.w, f.h, -f.w / 2, -f.h / 2, f.w, f.h)
        ctx.translate(-this.pos.x, -this.pos.y)
    }
}
