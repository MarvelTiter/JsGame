import { BaseSence } from "../../gamebase/BaseSence";
import { Vector2 } from "../../gamebase/data/Vector2";
import { Game } from "../../gamebase/Game";
import { GameObject } from "../../gamebase/objects/GameObject";
import { CanvasContext } from "../../gamebase/types/DefineType";
import { Dashboard } from "./Dashboard";
import { Clutchless } from "./pedal/Clutchless";

const ig = [
    3.385, //倒档 
    3.363, // 1档
    1.947, // 2档
    1.3, // 3档
    1.029, // 4档
    0.837, // 5档
    0.68, // 6档
]
/**
 * 怠速转速
 */
const idleRpm: number = 0.5
/**
 * 最大转速
 */
const maxRpm: number = 8
/**
 * 车轮半径
 */
const Radius: number = 0.367
/**
 * 传动系机械效率
 */
const eta: number = 1
/**
 * 摩擦系数
 */
const friction: number = 0.013
/**
 * 重力加速度
 */
const g: number = 9.8
/**
 * 质量
 */
const m: number = 1300
/**
 * 风阻系数
 */
const cda: number = 0.277
// https://blog.csdn.net/weixin_43795921/article/details/84957239

const Tq = (n: number) => -19.313 + 295.27 * (n / 1000) - 165.44 * Math.pow(n / 1000, 2) + 40.874 * Math.pow(n / 1000, 3) - 3.8445 * Math.pow(n / 1000, 4)
const Ua = (n: number, i: number) => 0.377 * Radius * n / ig[i] / ig[0]
const Ft = (tq: number, i: number) => tq * ig[i] * ig[0] * eta / (1000 * Radius)

export class Control extends GameObject {

    rpmDashboard: Dashboard
    speedDashboard: Dashboard
    clutchless?: Clutchless
    rpm: number = idleRpm
    speed: number = 0
    gear: number | undefined
    constructor(game: Game, sence: BaseSence) {
        super(game, sence)
        this.rpmDashboard = new Dashboard(Vector2.new(400, 400), 200, this.game, this.sence)
        this.rpmDashboard.ConfigurePanel(p => {
            p.startAngle = (135).angleToRadian()// (Math.PI / 2 + Math.PI / 4)
            p.endAngle = (45 + 360).angleToRadian()//Math.PI / 4 + Math.PI * 2
        }).ConfigureTick(t => {
            t.startAngle = (135).angleToRadian()
            t.endAngle = (45 + 360).angleToRadian()
            t.count = 8
            t.length = 20
            t.width = 5
        }).ConfigureTick(t => {
            t.startAngle = (135).angleToRadian()
            t.endAngle = (45 + 360).angleToRadian()
            t.count = 16
            t.length = 15
            t.width = 4
        }).ConfigureTick(t => {
            t.startAngle = (135).angleToRadian()
            t.endAngle = (45 + 360).angleToRadian()
            t.count = 8 * 10
            t.length = 10
            t.width = 3
        }).ConfigureLabel(l => {
            l.startAngle = (135).angleToRadian()
            l.endAngle = (45 + 360).angleToRadian()
            l.minValue = 0
            l.maxValue = 8
            l.count = 8
            l.offset = 150
            l.font = "20px sans-serif"
        }).ConfigureLabel(l => {
            l.offset = 40
            l.text = "rpm"
            l.labelPosition = "Bottom"
            l.font = "20px sans-serif"
        }).ConfigureNeedle(n => {
            n.startAngle = (135).angleToRadian()
            n.endAngle = (45 + 360).angleToRadian()
            n.value = 0
            n.minValue = 0
            n.maxValue = 8
            n.headOffset = 45
            n.updateDelta()
        })

        this.speedDashboard = new Dashboard(Vector2.new(900, 400), 200, this.game, this.sence)
        this.speedDashboard.ConfigurePanel(p => {
            p.startAngle = (135).angleToRadian()// (Math.PI / 2 + Math.PI / 4)
            p.endAngle = (45 + 360).angleToRadian()//Math.PI / 4 + Math.PI * 2
        }).ConfigureTick(t => {
            t.startAngle = (135).angleToRadian()
            t.endAngle = (45 + 360).angleToRadian()
            t.count = 13
            t.length = 20
            t.width = 4
        }).ConfigureTick(t => {
            t.startAngle = (135).angleToRadian()
            t.endAngle = (45 + 360).angleToRadian()
            t.count = 13 * 2
            t.length = 15
            t.width = 3
        }).ConfigureTick(t => {
            t.startAngle = (135).angleToRadian()
            t.endAngle = (45 + 360).angleToRadian()
            t.count = 13 * 10
            t.length = 10
            t.width = 2
        }).ConfigureLabel(l => {
            l.startAngle = (135).angleToRadian()
            l.endAngle = (45 + 360).angleToRadian()
            l.minValue = 0
            l.maxValue = 260
            l.count = 13
            l.offset = 160
            l.font = "16px sans-serif"
        }).ConfigureLabel(l => {
            l.offset = 40
            l.text = "km/h"
            l.labelPosition = "Bottom"
            l.font = "16px sans-serif"
        }).ConfigureNeedle(n => {
            n.startAngle = (135).angleToRadian()
            n.endAngle = (45 + 360).angleToRadian()
            n.value = 0
            n.minValue = 0
            n.maxValue = 260
            n.headOffset = 45
            n.updateDelta()
        })
    }

    calcCurrentState(): void {
        const t = Tq(3000)
        const f = Ft(t, 6)
        const fz = m * g * friction
    }

    override update(delta: number, timeScale: number, correction: number): void {
        this.calcCurrentState()
        this.rpmDashboard.updateValue(this.rpm)
        this.speedDashboard.updateValue(this.speed)
    }

    override draw(ctx: CanvasContext): void {
        this.rpmDashboard.draw(ctx)
        this.speedDashboard.draw(ctx)
    }


}
