import { BaseSence } from "../../gamebase/BaseSence"
import { Game } from "../../gamebase/Game"
import { Grid } from "./Grid"
import { Rect } from "../../gamebase/data/Rect"
import { GameEntity } from "../../gamebase/entities/GameEntity"
import { CanvasContext } from "../../gamebase/types/DefineType"

export class Cell extends GameEntity {
    gutter: number
    grid: Grid
    row: number
    column: number
    flag: number
    isOpen: boolean
    isMine: boolean
    count: number
    explode: boolean
    scanning: boolean
    constructor(game: Game, sence: BaseSence, grid: Grid, rowIndex: number, columnIndex: number, len: number) {
        super(game, sence, "normal")
        this.gutter = 0
        this.grid = grid
        this.row = rowIndex
        this.column = columnIndex
        this.flag = 0
        this.rect = Rect.createBoxRect(len, len)
        // this.pos.x = this.column * this.rect.w + (this.column + 1) * this.gutter
        // this.pos.y = this.row * this.rect.h + (this.row + 1) * this.gutter
        this.pos.x = len / 2 + this.column * len + grid.contentRelateOffset.x
        this.pos.y = len / 2 + this.row * len + grid.contentRelateOffset.y
        this.isOpen = false
        this.isMine = false
        this.count = 0
        this.explode = false
        this.scanning = false
    }

    setTexture(name: string) {
        this.image = this.game.getTextureByName(name)
    }

    updateState() {
        this.flag = (this.flag + 1) % 3
    }

    open() {
        if (this.isOpen) return
        this.isOpen = true
        this.grid.openCount++
        if (this.isMine) {
            this.explode = true
            this.grid.openAll()
            this.grid.gameOver = true
        }
        // 连锁开
        if (this.count == 0) {
            let rowIndex = this.row
            let colIndex = this.column
            for (let i = rowIndex - 1; i < rowIndex + 2; i++) {
                for (let j = colIndex - 1; j < colIndex + 2; j++) {
                    // 判断坐标防越界
                    if (i > -1 && j > -1 && i < this.grid.row && j < this.grid.column) {
                        // 递归
                        let temp = this.grid.data[i][j]
                        if (!temp.isMine) {
                            // setTimeout(() => {
                            // }, 50);
                            temp.open()
                        }
                    }
                }
            }
        }
    }
    setScanState() {
        this.scanning = true
        window.setTimeout(() => {
            this.scanning = false
        }, 200)
    }
    scan() {
        let flagCount = 0
        let rowIndex = this.row
        let colIndex = this.column

        let around = []
        for (let i = rowIndex - 1; i < rowIndex + 2; i++) {
            for (let j = colIndex - 1; j < colIndex + 2; j++) {
                //判断坐标防越界
                if (i > -1 && j > -1 && i < this.grid.row && j < this.grid.column) {
                    let temp = this.grid.data[i][j]
                    if (temp.flag == 1) flagCount++
                    else if (!temp.isOpen) {
                        temp.setScanState()
                        around.push(temp)
                    }
                }
            }
        }
        if (flagCount == this.count) {
            for (const t of around) {
                t.open()
            }
        }
    }

    update() {
        // 设置材质
        let name = "normal"
        if (!this.isOpen) {
            if (this.flag === 2) name = "unknow"
            else if (this.scanning) {
                name = "n0"
            } else if (this.focus && this.flag == 0) {
                name = "over"
            }
        } else {
            if (this.isMine) {
                name = this.explode ? "mineFail" : "mine"
            } else {
                name = "n" + this.count
            }
        }
        this.setTexture(name)
    }
    draw(context: CanvasContext): void {
        let ctx = context.game
        if (this.image !== undefined) {
            ctx.drawImage(this.image.texture, this.pos.x + this.offset.x - this.rect.w / 2, this.pos.y + this.offset.y - this.rect.h / 2, this.rect.w, this.rect.h)
        }
        this.drawFlag(ctx)
    }
    private drawFlag(ctx: CanvasRenderingContext2D) {
        let img = this.game.getTextureByName("flag")
        if (this.flag == 1) {
            ctx.drawImage(img.texture, this.pos.x + this.offset.x - this.rect.w / 2, this.pos.y + this.offset.y - this.rect.h / 2, this.rect.w, this.rect.h)
        }
        if (this.grid.gameOver && this.isMine && !this.isOpen) {
            ctx.drawImage(img.texture, this.pos.x + this.offset.x - this.rect.w / 2, this.pos.y + this.offset.y - this.rect.h / 2, this.rect.w, this.rect.h)
        }
    }
}
