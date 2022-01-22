class MineSence extends BaseSence {
  constructor(game) {
    super(game);
    this.row = 14;
    this.column = 14;
    this.maxCount = 30;
    this.setup();
  }
  setup() {
    // this.grid = new Grid(this.game, 10, 10);
    let bg = new Element(this.game, "bg");
    this.addElement(bg);
    // this.addElement(this.grid);
    // this.data = [];
    this.grid = new Grid(this.game, this.row, this.column);
    for (let r = 0; r < this.row; r++) {
      // let row = [];
      for (let c = 0; c < this.column; c++) {
        let cell = new Cell(this.game, this.grid, r, c);
        // row.push(cell);
        this.addElement(cell);
        this.grid.set(r, c, cell);
      }
      // this.data.push(row);
    }
    this.addElement(this.grid);
    this.grid.initMine(this.maxCount);
  }
}

class Grid extends Element {
  constructor(game, row, column) {
    super(game);
    this.data = [];
    this.row = row;
    this.column = column;
    for (let r = 0; r < row; r++) {
      let row = [];
      for (let c = 0; c < column; c++) {
        row.push(null);
      }
      this.data.push(row);
    }
  }
  set(r, c, cell) {
    this.data[r][c] = cell;
  }

  initMine(maxCount) {
    let c = 0;
    while (c < maxCount) {
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
  }

  open(target) {
    if (target.isOpen) return;
    target.isOpen = true;
    // 连锁开
    if (target.count == 0) {
      let rowIndex = target.row;
      let colIndex = target.column;
      for (let i = rowIndex - 1; i < rowIndex + 2; i++) {
        for (let j = colIndex - 1; j < colIndex + 2; j++) {
          // 判断坐标防越界
          if (i > -1 && j > -1 && i < this.row && j < this.column) {
            // 递归
            let temp = this.data[i][j];
            if (!temp.isMine) this.open(temp);
          }
        }
      }
    }
  }

  scan(target) {
    let flagCount = 0;
    let rowIndex = target.row;
    let colIndex = target.column;
    // for (let r = 0; r < this.row; r++) {
    //   for (let c = 0; c < this.column; c++) {
    //     let temp = this.data[r][c];
    //     if (!temp.isOpen) temp.scaning = false;
    //   }
    // }
    let around = [];
    for (let i = rowIndex - 1; i < rowIndex + 2; i++) {
      for (let j = colIndex - 1; j < colIndex + 2; j++) {
        //判断坐标防越界
        if (i > -1 && j > -1 && i < this.row && j < this.column) {
          let temp = this.data[i][j];
          if (temp.flag == 1) flagCount++;
          if (!temp.isOpen) {
            // temp.scaning = true;
            temp.setTexture("n0");
          }
        }
      }
    }

    if (flagCount == around.length) {
      for (const t of around) {
        this.open(t);
      }
    }
  }

  release(target) {
    let rowIndex = target.row;
    let colIndex = target.column;
    for (let i = rowIndex - 1; i < rowIndex + 2; i++) {
      for (let j = colIndex - 1; j < colIndex + 2; j++) {
        //判断坐标防越界
        if (i > -1 && j > -1 && i < this.row && j < this.column) {
          let temp = this.data[i][j];
          if (!temp.isOpen) {
            temp.scaning = false;
          }
        }
      }
    }
  }

  update() {
    if (!this.game.mouseAction.enable) return;
    let { offsetX, offsetY } = this.game.mouseAction.mouseArgs;
    // for (let r = 0; r < this.row; r++) {
    //   for (let c = 0; c < this.column; c++) {
    //     let temp = this.data[r][c];
    //     if (!temp.isOpen) temp.scaning = false;
    //   }
    // }
    let rowIndex = Math.floor(offsetY / 50);
    let colIndex = Math.floor(offsetX / 50);
    let temp = this.data[rowIndex][colIndex];
    if (temp && !temp.isOpen && temp.flag == 0) {
      temp.setTexture("over");
    }

    let ma = this.game.mouseAction;
    // if (ma.type != "move") {
    // }
    if (!ma.handled) {
      let { button, buttons } = ma.mouseArgs;
      if (ma.status == MOUSE_PRESS) {
        // 0,1 left
        if (button == 0 && buttons == 1) {
          this.open(temp);
        }
        // 2,2 right
        if (button == 2 && buttons == 2) {
          temp.updateState();
        }
        // 0,3 double
        if (button == 0 && buttons == 3) {
          this.scan(this);
        }
        ma.handled = true;
      } else if (ma.status == MOUSE_RELEASE) {
        this.release(this);
      }
    }
  }
}
