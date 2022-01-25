class Cell extends Element {
  constructor(game, sence, grid, rowIndex, columnIndex) {
    super(game, sence, "flag0");
    this.gutter = 0;
    this.grid = grid;
    this.row = rowIndex;
    this.column = columnIndex;
    this.flag = 0;
    this.w = 25;
    this.h = 25;
    this.x = this.column * this.w + (this.column + 1) * this.gutter;
    this.y = this.row * this.h + (this.row + 1) * this.gutter;
    this.isOpen = false;
    this.isMine = false;
    this.count = 0;
  }

  setTexture(name) {
    this.texture = this.game.getTextureByName(name);
  }

  updateState() {
    this.flag = (this.flag + 1) % 3;
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    if (this.isMine) {
      alert("游戏结束");
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
            if (!temp.isMine) temp.open();
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
    let name = "";
    if (!this.isOpen) {
      name = "flag" + this.flag;
      if (this.focus && this.flag == 0) {
        name = "over";
      }
    } else {
      if (this.isMine) {
        name = "mineFail";
      } else {
        name = "n" + this.count;
      }
      this.canDraw = false;
    }
    this.setTexture(name);
  }
}
