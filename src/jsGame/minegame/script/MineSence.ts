import { BaseSence } from "../../gamebase/BaseSence"
import { Game } from "../../gamebase/Game"
import { Head } from "./Head"
import { Footer } from "./Footer"
import { Grid } from "./Grid"
import { Button } from "../../gamebase/Button"
import { StartSence } from "./StartSence"
import { MineMapSize } from "./config"
import { Background } from "./Background"

export const basis = {
    row: 10,
    column: 10,
    mineCount: 10,
    len: 30
}

export const middle = {
    row: 16,
    column: 16,
    mineCount: 40,
    len: 30
}

export const professional = {
    row: 16,
    column: 30,
    mineCount: 99,
    len: 30
}

export const basis_m = {
    row: 10,
    column: 12,
    mineCount: 12,
    len: 30
}

export const middle_m = {
    row: 21,
    column: 12,
    mineCount: 40,
    len: 30
}

export const professional_m = {
    row: 40,
    column: 12,
    mineCount: 99,
    len: 24
}

export class MineSence extends BaseSence {
    level: MineMapSize
    constructor(game: Game, level: MineMapSize) {
        super(game)
        this.level = level
        this.setup()
        this.setupEvent()
    }
    grid!: Grid
    head!: Head
    footer!: Footer
    setup() {
        // 背景
        let bg = new Background(this.game, this)
        this.addElement(bg)
        // head
        this.head = new Head(this.game, this) as Head
        this.addElement(this.head)
        // footer
        this.footer = new Footer(this.game, this) as Footer
        this.footer.mineCount = this.level.mineCount
        this.addElement(this.footer)
        // 雷区
        this.grid = new Grid(this.game, this, this.level)

        this.addElement(this.grid)
        // let over = GameOverDialog.new(this.game, this);
        // this.addElement(over);
        let { w, h } = this.getWindowSize()
        let scale = this.game.device === "MOBILE" ? 0.6 : 1
        let restartButton = new Button(this.game, this, "button", "重新开始")
        restartButton.rect.scale!(scale)
        restartButton.pos.x = w / 2 - restartButton.rect.w / 2 - 10
        restartButton.pos.y = h - restartButton.rect.h / 2 - 50
        restartButton.onClick = () => {
            this.game.setSence(new MineSence(this.game, this.level))
        }
        this.addElement(restartButton)
        let homeBtn = new Button(this.game, this, "button", "返回")
        homeBtn.rect.scale!(scale)
        homeBtn.pos.x = w / 2 + homeBtn.rect.w / 2 + 10
        homeBtn.pos.y = restartButton.pos.y
        homeBtn.onClick = () => {
            this.game.areaSetup()
            this.game.setSence(new StartSence(this.game))
        }
        this.addElement(homeBtn)
    }
    setupEvent() {
        let self = this
        this.registerKeyAction(
            "a",
            () => {
                self.grid.randomOpen()
            },
            1
        )
        this.registerKeyAction(
            "m",
            () => {
                self.grid.openSafe()
            },
            1
        )
        this.grid.onFlagChanged = (g: Grid) => {
            this.footer.mineCount = g.mineCount - g.flagCount
        }
        this.grid.onTick = (g: Grid) => {
            this.footer.time = g.time
        }
    }
}
