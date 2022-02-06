import { BaseSence } from "../../gamebase/BaseSence";
import { GameObject } from "../../gamebase/GameObject";
import { Game } from "../../gamebase/Game";
import { Cell } from "./Cell";

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
  mineCount: number;
  onFlagChanged: Function | undefined;
  time: string;
  timer: number;
  gameOver: boolean = false;
  constructor(
    game: Game,
    sence: BaseSence,
    row: number,
    column: number,
    maxCount: number,
  ) {
    super(game, sence);
    this.row = row;
    this.column = column;
    this.w = column * 25;
    this.h = row * 25;
    this.offsetX = (1200 - column * 25) / 2;
    this.offsetY = (800 - row * 25) / 2;
    this.mineCount = maxCount;
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
    // this.sence.registerKeyAction(
    //   "f",
    //   (e) => {
    //     let i = Item.new(this.game, this.sence);
    //     this.sence.addElement(i);
    //   },
    //   true,
    // );
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
        let cell = Cell.new<Cell>(this.game, this.sence, this, r, c);
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

  public onMouseOver(e: MouseEvent): void {
    let { offsetX, offsetY } = e;
    for (let r = 0; r < this.row; r++) {
      for (let c = 0; c < this.column; c++) {
        let temp = this.data[r][c];
        temp.checkFocu(offsetX, offsetY);
      }
    }
  }

  public onClick(e: MouseEvent): void {
    let { offsetX, offsetY, button, buttons } = e;
    let c = Math.floor((offsetX - this.offsetX) / 25);
    let r = Math.floor((offsetY - this.offsetY) / 25);
    if (c > -1 && c < this.column && r > -1 && r < this.row) {
      let temp = this.data[r][c];
      if (!temp) return;
      if (!temp.isOpen) {
        // 0,1 left
        if (button == 0) {
          temp.open();
        }
        // 2,2 right
        if (button == 2) {
          let oldState = temp.flag;
          temp.updateState();
          if (temp.flag == 1 && oldState == 0) {
            this.mineCount--;
          } else if (temp.flag == 2 && oldState == 1) {
            this.mineCount++;
          }
          if (this.onFlagChanged !== undefined) this.onFlagChanged(this);
        }
      }
      // 0,3 double
      else if (buttons >= 2) {
        temp.scan();
      }
    }
  }

  // update() {
  //   if (this.onTick !== undefined) this.onTick(this);
  // }

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
