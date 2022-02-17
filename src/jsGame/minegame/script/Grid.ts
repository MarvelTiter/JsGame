import { BaseSence } from "../../gamebase/BaseSence"
import { GameObject } from "../../gamebase/objects/GameObject"
import { DEVICE_MOBILE, Game } from "../../gamebase/Game"
import { Cell } from "./Cell"
import { Firework } from "./Firework"
import { MineMapSize } from "./config"
import { MouseArgs } from "../../gamebase/MouseArgs"
import { CustomObject } from "../../gamebase/objects/CustomObject"

function PadLeft(v: string, len: number, char: string): string {
    if (v.length < len) {
        return PadLeft(`${char}${v}`, len, char)
    }
    return v.toString()
}
export class Grid extends CustomObject {
    data!: Array<Array<Cell>>
    row: number
    column: number
    flagCount: number = 0
    onFlagChanged: Function | undefined
    time: string
    timer: number
    gameOver: boolean = false
    success: number = 0
    openCount: number = 0
    mineCount: number
    cellLen: number
    touchTimer: number | undefined
    temp: Cell | undefined
    constructor(game: Game, sence: BaseSence, level: MineMapSize) {
        super(game, sence)
        this.row = level.row
        this.column = level.column
        if (this.game.device === DEVICE_MOBILE) {
            level.len = document.body.clientWidth / 12
        }
        this.cellLen = level.len
        this.size.w = this.column * level.len
        this.size.h = this.row * level.len
        let { w, h } = this.sence.getWindowSize()
        this.offset.x = (w - this.column * this.cellLen) / 2
        let marginTop = (h - this.row * this.cellLen) / 2
        if (marginTop < 50) {
            marginTop = 50
            this.game.reSize(w, 100 + this.row * this.cellLen)
        }
        this.offset.y = marginTop
        this.mineCount = level.mineCount
        this.time = "00:00:00"
        this.timer = -1

        this.init()
    }

    public start(): void {
        let sec = 0
        let min = 0
        let hour = 0
        window.clearInterval(this.timer)
        this.timer = window.setInterval(() => {
            if (this.gameOver) {
                window.clearInterval(this.timer)
                return
            }
            sec++
            if (sec > 59) {
                sec = 0
                min++
            }
            if (min > 59) {
                min = 0
                hour++
            }
            this.time = `${PadLeft(hour.toString(), 2, "0")}:${PadLeft(min.toString(), 2, "0")}:${PadLeft(sec.toString(), 2, "0")}`
        }, 1000)
    }

    init() {
        // 初始化 data
        this.data = new Array<Cell[]>()
        for (let r = 0; r < this.row; r++) {
            let row = new Array<Cell>()
            for (let c = 0; c < this.column; c++) {
                let cell = new Cell(this.game, this.sence, this, r, c, this.cellLen)
                cell.offset = this.offset
                row.push(cell)

                this.sence.addElement(cell)
            }
            this.data.push(row)
        }
        // 设置地雷
        let c = 0
        while (c < this.mineCount) {
            let rowIndex = Math.floor(Math.random() * this.row)
            let colIndex = Math.floor(Math.random() * this.column)
            let cell = this.data[rowIndex][colIndex]
            if (!cell.isMine) {
                cell.isMine = true
                c++
                //更新九宫格内非雷方格的计雷数
                for (let i = rowIndex - 1; i < rowIndex + 2; i++) {
                    for (let j = colIndex - 1; j < colIndex + 2; j++) {
                        //判断坐标防越界
                        if (i > -1 && j > -1 && i < this.row && j < this.column) {
                            //计雷数+1
                            this.data[i][j].count++
                        }
                    }
                }
            }
        }
        this.openSafe()
        this.start()
    }

    randomOpen() {
        if (this.gameOver) return
        while (true) {
            let r = Math.floor(Math.random() * this.row)
            let c = Math.floor(Math.random() * this.column)
            let temp = this.data[r][c]
            if (!temp.isOpen) {
                this.openCell(temp)
                break
            }
        }
    }

    openSafe() {
        if (this.gameOver) return
        while (true) {
            let r = Math.floor(Math.random() * this.row)
            let c = Math.floor(Math.random() * this.column)
            let temp = this.data[r][c]
            if (!temp.isOpen && !temp.isMine) {
                this.openCell(temp)
                break
            }
        }
    }

    public openAll(): void {
        for (let r = 0; r < this.row; r++) {
            for (let c = 0; c < this.column; c++) {
                let cell = this.data[r][c]
                cell.isOpen = true
            }
        }
        // let overDialog = GameOverDialog.new(this.game, this.sence);
        // this.sence.addElement(overDialog);
    }

    private openCell(temp: Cell) {
        if (temp.flag === 0) {
            temp.open()
            this.checkWin()
        }
    }

    private makeFlag(temp: Cell) {
        let oldState = temp.flag
        temp.updateState()
        if (temp.flag == 1 && oldState == 0) {
            if (temp.isMine) this.success++
            this.flagCount++
        } else if (temp.flag == 2 && oldState == 1) {
            if (temp.isMine) this.success--
            this.flagCount--
        }
        if (this.onFlagChanged !== undefined) this.onFlagChanged(this)
    }

    private checkWin() {
        if (
            this.row * this.column - this.openCount === this.mineCount || // 没打开的数量等于雷的数量
            (this.flagCount === this.mineCount && this.success === this.flagCount)
        ) {
            this.gameOver = true
            let fw1 = new Firework(this.game, this.sence, "firework_green")
            let fw2 = new Firework(this.game, this.sence, "firework_red")
            this.sence.addElement(fw1)
            this.sence.addElement(fw2)
        }
    }

    private findCell(x: number, y: number): Cell | undefined {
        let c = Math.floor((x - this.offset.x) / this.cellLen)
        let r = Math.floor((y - this.offset.y) / this.cellLen)
        if (c > -1 && c < this.column && r > -1 && r < this.row) {
            return this.data[r][c]
        }
        return undefined
    }

    public onMouseOver(e: MouseArgs): void {
        let { x, y } = e
        for (let r = 0; r < this.row; r++) {
            for (let c = 0; c < this.column; c++) {
                let temp = this.data[r][c]
                temp.checkFocu(x, y)
            }
        }
    }

    public onClick(e: MouseArgs): void {
        let { x, y, button, buttons } = e
        let temp = this.findCell(x, y)
        if (!temp) return
        if (this.game.device === DEVICE_MOBILE) {
            return
        } else {
            if (!temp.isOpen) {
                // 0 left
                if (button == 0) {
                    this.openCell(temp)
                }
                // 2 right
                if (button == 2) {
                    this.makeFlag(temp)
                }
            } else if ((button = 2)) {
                temp.scan()
            }
        }
        this.checkWin()
    }

    onTouchStart(e: MouseArgs): void {
        let { x, y } = e
        this.temp = this.findCell(x, y)
        if (this.temp === undefined) return
        this.touchTimer = window.setTimeout(() => {
            if (this.temp === undefined) return
            if (!this.temp.isOpen) this.openCell(this.temp)
            window.clearTimeout(this.touchTimer)
            this.touchTimer = undefined
        }, 500)
    }
    onTouchMove(e: MouseArgs): void {
        if (this.touchTimer) {
            window.clearTimeout(this.touchTimer)
            this.touchTimer = undefined
        }
    }
    onTouchEnd(): void {
        if (this.touchTimer) {
            window.clearTimeout(this.touchTimer)
            this.touchTimer = undefined
        }
        if (!this.temp) {
            return
        }
        if (!this.temp.isOpen) {
            this.makeFlag(this.temp)
        } else {
            this.temp.scan()
        }
    }
    updateRequest(): boolean {
        return true
    }
    // update(): void {
    //   super.update();
    //   let fw = new Firework(this.game, this.sence, "fireworks_g");
    //   fw.x = Math.random() * this.game.getWidth();
    //   fw.y = Math.random() * this.game.getHeight();
    //   this.sence.addElement(fw);
    //   console.log("fire");
    // }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "rgba(0,0,0,0)"
        ctx.fillRect(this.pos.x + this.offset.x, this.pos.y + this.offset.y, this.size.w, this.size.h)
    }
}
