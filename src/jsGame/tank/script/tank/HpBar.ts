import { BaseSence } from "../../../gamebase/BaseSence"
import { Game } from "../../../gamebase/Game"
import { IHp } from "../../../gamebase/interfaces/IHp"
import { CustomObject } from "../../../gamebase/objects/CustomObject"

export class HpBar {
    owner: IHp
    lineWidth: number = 2
    constructor(owner: IHp) {
        this.owner = owner
    }
    draw(ctx: CanvasRenderingContext2D): void {
        let { x, y } = this.owner.getPos()
        let w = this.owner.barWidth
        let h = this.owner.barHeight
        // 画框框
        ctx.save()
        ctx.translate(x, y)
        ctx.lineWidth = this.lineWidth
        ctx.beginPath()
        ctx.strokeStyle = "#a9a9a9"
        ctx.rect(-w / 2, -h / 2, w, h)
        ctx.closePath()
        ctx.stroke()
        // 画血量剩余
        let innerW = w - this.lineWidth * 2
        if (this.owner.remain < 0) this.owner.remain = 0
        let rw = (this.owner.remain / this.owner.max) * innerW
        ctx.beginPath()
        ctx.fillStyle = "#00ff00"
        ctx.fillRect(-w / 2 + this.lineWidth, -h / 2 + this.lineWidth, rw, h - this.lineWidth * 2)
        ctx.fill()
        ctx.closePath()
        // 画血量损失
        if (innerW - rw > 0) {
            ctx.beginPath()
            ctx.fillStyle = "#ff0000"
            ctx.fillRect(-w / 2 + this.lineWidth + rw, -h / 2 + this.lineWidth, innerW - rw, h - this.lineWidth * 2)
            ctx.fill()
            ctx.closePath()
        }
        ctx.translate(-x, -y)
        ctx.restore()
    }
}
