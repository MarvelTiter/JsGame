import { BaseSence } from "../../gamebase/BaseSence"
import { DEVICE_MOBILE, Game } from "../../gamebase/Game"
import { Button } from "../../gamebase/Button"
import { Dashboard } from "./Dashboard"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Control } from "./Control"

export class StartSence extends BaseSence {
    constructor(game: Game) {
        super(game)
        this.setup()
    }

    setup() {
        // let rpm = new Dashboard(Vector2.new(400, 400), 200, this.game, this)
        // rpm.ConfigurePanel(p => {
        //     p.startAngle = (135).angleToRadian()// (Math.PI / 2 + Math.PI / 4)
        //     p.endAngle = (45 + 360).angleToRadian()//Math.PI / 4 + Math.PI * 2
        // }).ConfigureTick(t => {
        //     t.startAngle = (135).angleToRadian()
        //     t.endAngle = (45 + 360).angleToRadian()
        //     t.count = 8
        //     t.length = 20
        //     t.width = 5
        // }).ConfigureTick(t => {
        //     t.startAngle = (135).angleToRadian()
        //     t.endAngle = (45 + 360).angleToRadian()
        //     t.count = 16
        //     t.length = 15
        //     t.width = 4
        // }).ConfigureTick(t => {
        //     t.startAngle = (135).angleToRadian()
        //     t.endAngle = (45 + 360).angleToRadian()
        //     t.count = 8 * 10
        //     t.length = 10
        //     t.width = 3
        // }).ConfigureLabel(l => {
        //     l.startAngle = (135).angleToRadian()
        //     l.endAngle = (45 + 360).angleToRadian()
        //     l.minValue = 0
        //     l.maxValue = 8
        //     l.count = 8
        //     l.offset = 150
        //     l.font = "20px sans-serif"
        // }).ConfigureLabel(l => {
        //     l.offset = 40
        //     l.text = "rpm"
        //     l.labelPosition = "Bottom"
        //     l.font = "20px sans-serif"
        // }).ConfigureNeedle(n => {
        //     n.startAngle = (135).angleToRadian()
        //     n.endAngle = (45 + 360).angleToRadian()
        //     n.value = 0
        //     n.minValue = 0
        //     n.maxValue = 8
        //     n.headOffset = 45
        //     n.updateDelta()
        // })

        // let speed = new Dashboard(Vector2.new(900, 400), 200, this.game, this)
        // speed.ConfigurePanel(p => {
        //     p.startAngle = (135).angleToRadian()// (Math.PI / 2 + Math.PI / 4)
        //     p.endAngle = (45 + 360).angleToRadian()//Math.PI / 4 + Math.PI * 2
        // }).ConfigureTick(t => {
        //     t.startAngle = (135).angleToRadian()
        //     t.endAngle = (45 + 360).angleToRadian()
        //     t.count = 22
        //     t.length = 20
        //     t.width = 4
        // }).ConfigureTick(t => {
        //     t.startAngle = (135).angleToRadian()
        //     t.endAngle = (45 + 360).angleToRadian()
        //     t.count = 22 * 2
        //     t.length = 15
        //     t.width = 3
        // }).ConfigureTick(t => {
        //     t.startAngle = (135).angleToRadian()
        //     t.endAngle = (45 + 360).angleToRadian()
        //     t.count = 22 * 10
        //     t.length = 10
        //     t.width = 2
        // }).ConfigureLabel(l => {
        //     l.startAngle = (135).angleToRadian()
        //     l.endAngle = (45 + 360).angleToRadian()
        //     l.minValue = 0
        //     l.maxValue = 220
        //     l.count = 22
        //     l.offset = 160
        //     l.font = "16px sans-serif"
        // }).ConfigureLabel(l => {
        //     l.offset = 40
        //     l.text = "km/h"
        //     l.labelPosition = "Bottom"
        //     l.font = "16px sans-serif"
        // })
        const control = new Control(this.game, this)
        this.addElement(control)
        // this.addElement(speed)
    }
}
