import { BaseSence } from "../../gamebase/BaseSence"
import { DEVICE_MOBILE, Game } from "../../gamebase/Game"
import { Head } from "./Head"
import { basis, basis_m, middle, middle_m, MineSence, professional, professional_m } from "./MineSence"
import { Button } from "../../gamebase/Button"
import { Background } from "./Background"

export class StartSence extends BaseSence {
    constructor(game: Game) {
        super(game)
        this.setup()
    }

    setup() {
        let bg = new Background(this.game, this)
        let head = new Head(this.game, this)
        this.addElement(bg)
        this.addElement(head)

        let { w, h } = this.getWindowSize()
        let btnMiddleLevel = new Button(this.game, this, "button", "中级")
        btnMiddleLevel.pos.x = w / 2
        btnMiddleLevel.pos.y = h / 2
        this.addElement(btnMiddleLevel)
        btnMiddleLevel.onClick = () => {
            let ms = new MineSence(this.game, this.game.device === DEVICE_MOBILE ? middle_m : middle)
            this.game.setSence(ms)
        }

        let btnBasisLevel = new Button(this.game, this, "button", "初级")
        btnBasisLevel.pos.x = w / 2
        btnBasisLevel.pos.y = btnMiddleLevel.pos.y - (70).actualPixel()
        this.addElement(btnBasisLevel)
        btnBasisLevel.onClick = () => {
            let ms = new MineSence(this.game, this.game.device === DEVICE_MOBILE ? basis_m : basis)
            this.game.setSence(ms)
        }

        let btnProLevel = new Button(this.game, this, "button", "专家")
        btnProLevel.pos.x = w / 2
        btnProLevel.pos.y = btnMiddleLevel.pos.y + (70).actualPixel()
        this.addElement(btnProLevel)
        btnProLevel.onClick = () => {
            let ms = new MineSence(this.game, this.game.device === DEVICE_MOBILE ? professional_m : professional)
            this.game.setSence(ms)
        }
    }
}
