import { BaseSence } from "../../gamebase/BaseSence";
import { GameObject } from "../../gamebase/GameObject";
import { Game } from "../../gamebase/Game";
import { Grid } from "./Grid";
import { config } from "./config";

export class Cell extends GameObject {
  gutter: number;
  grid: Grid;
  row: number;
  column: number;
  flag: number;
  isOpen: boolean;
  isMine: boolean;
  count: number;
  explode: boolean;
  // explode: boolean;
  constructor(
    game: Game,
    sence: BaseSence,
    grid: Grid,
    rowIndex: number,
    columnIndex: number,
  ) {
    super(game, sence, "normal");
    this.gutter = 0;
    this.grid = grid;
    this.row = rowIndex;
    this.column = columnIndex;
    this.flag = 0;
    this.w = config.CellSize.len;
    this.h = config.CellSize.len;
    this.x = this.column * this.w + (this.column + 1) * this.gutter;
    this.y = this.row * this.h + (this.row + 1) * this.gutter;
    this.isOpen = false;
    this.isMine = false;
    this.count = 0;
    this.explode = false;
  }

  setTexture(name: string) {
    this.image = this.game.getTextureByName(name);
  }

  updateState() {
    this.flag = (this.flag + 1) % 3;
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.grid.openCount++
    if (this.isMine) {
      this.explode = true;
      this.grid.openAll();
      this.grid.gameOver = true
    }
    // 连锁开
    if (this.count == 0) {
      let rowIndex = this.row;
      let colIndex = this.column;
      for (let i = rowIndex - 1; i < rowIndex + 2; i++) {
        for (let j = colIndex - 1; j < colIndex + 2; j++) {
          // 判断坐标防越界
          if (i > -1 && j > -1 && i < this.grid.row && j < this.grid.column) {
            // 递归
            let temp = this.grid.data[i][j];
            if (!temp.isMine) {
              // setTimeout(() => {
              // }, 50);
              temp.open();
            }
          }
        }
      }
    }
  }

  scan() {
    let flagCount = 0;
    let rowIndex = this.row;
    let colIndex = this.column;

    let around = [];
    for (let i = rowIndex - 1; i < rowIndex + 2; i++) {
      for (let j = colIndex - 1; j < colIndex + 2; j++) {
        //判断坐标防越界
        if (i > -1 && j > -1 && i < this.grid.row && j < this.grid.column) {
          let temp = this.grid.data[i][j];
          if (temp.flag == 1) flagCount++;
          else if (!temp.isOpen) {
            around.push(temp);
          }
        }
      }
    }
    if (flagCount == this.count) {
      for (const t of around) {
        t.open();
      }
    }
  }

  update() {
    // 设置材质
    let name = "normal";
    if (!this.isOpen) {
      if (this.flag === 2) name = "unknow";
      // name = "flag" + this.flag;
      else if (this.focus && this.flag == 0) {
        name = "over";
      }
    } else {
      if (this.isMine) {
        name = this.explode ? "mineFail" : "mine";
      } else {
        name = "n" + this.count;
      }
    }
    this.setTexture(name);
  }

  draw(): void {
    if (this.image !== undefined) {
      this.game.context.drawImage(
        this.image.texture,
        this.x + this.offsetX,
        this.y + this.offsetY,
        this.w,
        this.h,
      );
    }
    if (this.flag == 1) {
      let img = this.game.getTextureByName("flag");
      this.game.context.drawImage(
        img.texture,
        this.x + this.offsetX,
        this.y + this.offsetY,
        this.w,
        this.h,
      );
    }
  }
}
