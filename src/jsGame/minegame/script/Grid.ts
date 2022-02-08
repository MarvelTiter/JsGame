import { BaseSence } from "../../gamebase/BaseSence";
import { GameObject } from "../../gamebase/GameObject";
import { DEVICE_MOBILE, Game } from "../../gamebase/Game";
import { Cell } from "./Cell";
import { Firework } from "./Firework";
import { MineMapSize } from "./config";
import { MouseArgs } from "../../gamebase/MouseArgs";

function PadLeft(v: string, len: number, char: string): string {
  if (v.length < len) {
    return PadLeft(`${char}${v}`, len, char);
  }
  return v.toString();
}
export class Grid extends GameObject {
  data!: Array<Array<Cell>>;
  row: number;
  column: number;
  flagCount: number = 0
  onFlagChanged: Function | undefined;
  time: string;
  timer: number;
  gameOver: boolean = false;
  success: number = 0
  openCount: number = 0
  mineCount: number
  cellLen: number
  touchTimer: number | undefined
  temp: Cell | undefined
  constructor(
    game: Game,
    sence: BaseSence,
    level: MineMapSize
  ) {
    super(game, sence);
    this.cellLen = level.len
    this.row = level.row;
    this.column = level.column;
    this.w = this.column * level.len;
    this.h = this.row * level.len;
    this.offsetX = (this.game.area.width - this.column * this.cellLen) / 2;
    this.offsetY = (this.game.area.height - this.row * this.cellLen) / 2;
    this.mineCount = level.mineCount
    this.time = "00:00:00";
    this.timer = -1;

    this.init();
    this.setupEvent();
  }
  setupEvent() {
    this.sence.registerKeyAction(
      "a",
      (e: MouseEvent) => {
        this.randomOpen();
      },
      true,
    );
  }

  public start(): void {
    let sec = 0;
    let min = 0;
    let hour = 0;
    window.clearInterval(this.timer);
    this.timer = window.setInterval(() => {
      if (this.gameOver) {
        window.clearInterval(this.timer);
        return;
      }
      sec++;
      if (sec > 59) {
        sec = 0;
        min++;
      }
      if (min > 59) {
        min = 0;
        hour++;
      }
      this.time = `${PadLeft(hour.toString(), 2, "0")}:${PadLeft(
        min.toString(),
        2,
        "0",
      )}:${PadLeft(sec.toString(), 2, "0")}`;
    }, 1000);
  }

  init() {
    // 初始化 data
    this.data = new Array<Cell[]>();
    for (let r = 0; r < this.row; r++) {
      let row = new Array<Cell>();
      for (let c = 0; c < this.column; c++) {
        let cell = Cell.new<Cell>(this.game, this.sence, this, r, c, this.cellLen);
        cell.offsetX = this.offsetX;
        cell.offsetY = this.offsetY;
        row.push(cell);

        this.sence.addElement(cell);
      }
      this.data.push(row);
    }
    // 设置地雷
    let c = 0;
    while (c < this.mineCount) {
      let rowIndex = Math.floor(Math.random() * this.row);
      let colIndex = Math.floor(Math.random() * this.column);
      let cell = this.data[rowIndex][colIndex];
      if (!cell.isMine) {
        cell.isMine = true;
        c++;
        //更新九宫格内非雷方格的计雷数
        for (let i = rowIndex - 1; i < rowIndex + 2; i++) {
          for (let j = colIndex - 1; j < colIndex + 2; j++) {
            //判断坐标防越界
            if (i > -1 && j > -1 && i < this.row && j < this.column) {
              //计雷数+1
              this.data[i][j].count++;
            }
          }
        }
      }
    }
    this.start();
  }

  randomOpen() {
    while (true) {
      let r = Math.floor(Math.random() * this.row);
      let c = Math.floor(Math.random() * this.column);
      let temp = this.data[r][c];
      if (!temp.isOpen) {
        temp.open();
        break;
      }
    }
  }

  public openAll(): void {
    for (let r = 0; r < this.row; r++) {
      for (let c = 0; c < this.column; c++) {
        let cell = this.data[r][c];
        cell.isOpen = true;
      }
    }
    // let overDialog = GameOverDialog.new(this.game, this.sence);
    // this.sence.addElement(overDialog);
  }

  private openCell(temp: Cell) {
    if (temp.flag === 0)
      temp.open();
  }

  private makeFlag(temp: Cell) {
    let oldState = temp.flag;
    temp.updateState();
    if (temp.flag == 1 && oldState == 0) {
      if (temp.isMine)
        this.success++
      this.flagCount++;
    } else if (temp.flag == 2 && oldState == 1) {
      if (temp.isMine)
        this.success--
      this.flagCount--;
    }
    if (this.onFlagChanged !== undefined) this.onFlagChanged(this);
  }

  private checkWin() {
    if (((this.row * this.column - this.openCount) === this.mineCount) // 没打开的数量等于雷的数量
      || (this.flagCount === this.mineCount && this.success === this.flagCount)) {
      this.gameOver = true
      let fw1 = new Firework(this.game, this.sence, "fireworks_g")
      let fw2 = new Firework(this.game, this.sence, "fireworks_r")
      this.sence.addElement(fw1)
      this.sence.addElement(fw2)
    }
  }

  private findCell(x: number, y: number): Cell | undefined {
    let c = Math.floor((x - this.offsetX) / this.cellLen);
    let r = Math.floor((y - this.offsetY) / this.cellLen);
    if (c > -1 && c < this.column && r > -1 && r < this.row) {
      return this.data[r][c];
    }
    return undefined
  }

  public onMouseOver(e: MouseArgs): void {
    let { x, y } = e;
    for (let r = 0; r < this.row; r++) {
      for (let c = 0; c < this.column; c++) {
        let temp = this.data[r][c];
        temp.checkFocu(x, y);
      }
    }
  }

  public onClick(e: MouseArgs): void {
    let { x, y, button, buttons } = e;
    let temp = this.findCell(x, y)
    if (!temp) return;
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
      }
      else if (button = 2) {
        temp.scan();
      }
    }
    this.checkWin()

  }

  onTouchStart(e: MouseArgs): void {
    let { x, y } = e
    this.temp = this.findCell(x, y)
    if (this.temp === undefined) return;
    this.touchTimer = window.setTimeout(() => {
      if (this.temp === undefined) return;
      if (!this.temp.isOpen)
        this.openCell(this.temp)
      window.clearTimeout(this.touchTimer)
      this.touchTimer = undefined
    }, 500)
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

  draw() {
    this.game.context.fillStyle = "rgba(0,0,0,0)";
    this.game.context.fillRect(
      this.x + this.offsetX,
      this.y + this.offsetY,
      this.w,
      this.h,
    );
  }
}
