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
    }
    setup() {
        // 背景
        let bg = new Background(this.game, this)
        this.addElement(bg)
        // head
        let head = new Head(this.game, this) as Head
        this.addElement(head)
        // footer
        let footer = new Footer(this.game, this) as Footer
        footer.mineCount = this.level.mineCount
        this.addElement(footer)
        // 雷区
        let grid = new Grid(this.game, this, this.level)
        this.registerKeyAction(
            "a",
            function (status) {
                grid.randomOpen()
            },
            1
        )
        this.registerKeyAction(
            "m",
            function (status) {
                grid.openSafe()
            },
            1
        )
        grid.onFlagChanged = (g: Grid) => {
            footer.mineCount = g.mineCount - g.flagCount
        }
        grid.onTick = (g: Grid) => {
            footer.time = g.time
        }
        this.addElement(grid)
        // let over = GameOverDialog.new(this.game, this);
        // this.addElement(over);
        let { w, h } = this.getWindowSize()
        let restartButton = new Button(this.game, this, "button", "重新开始")
        restartButton.pos.x = w - restartButton.rect.w / 2 - 20
        restartButton.pos.y = h - restartButton.rect.h / 2 - 20
        restartButton.canDraw = () => {
            return grid.gameOver
        }
        restartButton.onClick = () => {
            this.game.setSence(new StartSence(this.game))
        }
        this.addElement(restartButton)
    }
}
