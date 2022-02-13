import { BaseSence } from "../../gamebase/BaseSence"
import { GameEntity } from "../../gamebase/GameEntity"
import { DEVICE_MOBILE, Game } from "../../gamebase/Game"
import { Head } from "./Head"
import { basis, basis_m, middle, middle_m, MineSence, professional, professional_m } from "./MineSence"
import { Button } from "../../gamebase/Button"
import { AnimaObject } from "../../gamebase/AnimaObject"
import { Firework } from "./Firework"
import { GameObject } from "../../gamebase/GameObject"

export class StartSence extends BaseSence {
    constructor(game: Game) {
        super(game)
        this.setup()
    }

    setup() {
        let bg = new GameEntity(this.game, this, "bg")
        let head = new Head(this.game, this)
        this.addElement(bg)
        this.addElement(head)

        // let ani = new AnimaObject(this.game, this, "firework_green")
        // this.addElement(ani)

        // let ani2 = new AnimaObject(this.game, this, "attack_effect")
        // ani2.pos.x = 200
        // this.addElement(ani2)

        // let ani3 = new AnimaObject(this.game, this, "attack_effect_explode")
        // ani3.pos.x = 350
        // this.addElement(ani3)
        let { w } = this.getWindowSize()
        let btnMiddleLevel = new Button(this.game, this, "button", "中级")
        btnMiddleLevel.pos.x = w / 2
        btnMiddleLevel.pos.y = 100 + btnMiddleLevel.size.h
        this.addElement(btnMiddleLevel)
        btnMiddleLevel.onClick = () => {
            let ms = new MineSence(this.game, this.game.device === DEVICE_MOBILE ? middle_m : middle)
            this.game.setSence(ms)
        }

        let btnBasisLevel = new Button(this.game, this, "button", "初级")
        btnBasisLevel.pos.x = w / 2
        btnBasisLevel.pos.y = 100
        this.addElement(btnBasisLevel)
        btnBasisLevel.onClick = () => {
            let ms = new MineSence(this.game, this.game.device === DEVICE_MOBILE ? basis_m : basis)
            this.game.setSence(ms)
        }

        let btnProLevel = new Button(this.game, this, "button", "专家")
        btnProLevel.pos.x = w / 2
        btnProLevel.pos.y = 100 + btnMiddleLevel.size.h * 2
        this.addElement(btnProLevel)
        btnProLevel.onClick = () => {
            let ms = new MineSence(this.game, this.game.device === DEVICE_MOBILE ? professional_m : professional)
            this.game.setSence(ms)
        }
    }
}
