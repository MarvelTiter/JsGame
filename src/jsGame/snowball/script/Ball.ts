import { BaseSence } from "../../gamebase/BaseSence"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { CustomObject } from "../../gamebase/objects/CustomObject"
interface SnowBallTail {
    x: number
    y: number
    degree: number
}
export class Ball extends CustomObject {
    direction: number = -1
    turnTo: boolean = false
    degree: number = 0
    maxDegree: number = 50
    minDegree: number = -50
    distance: number = 2
    tailMaxLength: number = 50
    color: string = "#d2fdff"
    tailList: Array<SnowBallTail> = []
    constructor(game: Game, sence: BaseSence) {
        super(game, sence)
        this.radius = 10
    }

    move() {
        // 小球正在转向
        if (this.turnTo && this.direction) {
            // 递增旋转角度
            this.degree = this.degree + (this.direction > 0 ? 1 : -1) * 1.6 // 增加一点转向灵敏度
            // 限制最大、最小旋转角度
            if (this.degree > this.maxDegree) {
                this.degree = this.maxDegree
            } else if (this.degree < this.minDegree) {
                this.degree = this.minDegree
            }
        }

        const radian = (this.degree * Math.PI) / 180
        const offsetX = Math.sin(radian) * this.distance
        const offsetY = Math.cos(radian) * this.distance

        // const offsetX = 0
        // const offsetY = 0
        this.pos.x += offsetX
        this.pos.y += offsetY

        // 记录小球移动的位置以及角度
        this.tailList.unshift({
            x: this.pos.x,
            y: this.pos.y,
            degree: this.degree
        })
        if (this.tailList.length > this.tailMaxLength) {
            this.tailList.splice(this.tailMaxLength)
        }
        this.offset = new Vector2(offsetX, offsetY)
        this.turnTo = false
    }
    interval: number = 100
    update(): void {
        this.move()

        let { w } = this.sence.camera.window
        let { x } = this.sence.camera.pos
        if (this.pos.x - this.radius < x - this.radius * 2 || this.pos.x - this.radius > x + w) {
            console.log("game over")
        }
    }
    draw(ctx: CanvasRenderingContext2D): void {
        {
            // 绘制小球尾巴
            const tailListsLength = this.tailList.length
            if (tailListsLength) {
                let index = 0
                let step = 1
                ctx.beginPath()
                const paint = () => {
                    if (index < 0) return
                    const { x, y, degree } = this.tailList[index]
                    const _radius = this.radius - (this.radius * (index + 1)) / tailListsLength
                    const radian = (degree * Math.PI) / 180
                    const cos = Math.cos(radian) * _radius * step
                    const sin = Math.sin(radian) * _radius * step

                    ctx.lineTo(x - cos, y + sin)
                    if (index === tailListsLength - 1) step = -1
                    index += step
                    paint()
                }
                paint()

                ctx.closePath()

                const firstTail = this.tailList[0]
                const lastTail = this.tailList[tailListsLength - 1]
                const line = ctx.createLinearGradient(firstTail.x, firstTail.y, lastTail.x, lastTail.y)

                try {
                    line.addColorStop(0, this.color + "80")
                    line.addColorStop(1, this.color + "10")
                    ctx.fillStyle = line
                } catch (e) {
                    ctx.fillStyle = this.color + "60"
                }

                ctx.fill()
            }
        }

        // 绘制小球
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
        ctx.fill()
    }
}