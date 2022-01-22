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
    this.grid = new Grid(this.row, this.column);
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
    this.grid.initMine(this.maxCount);
  }
}

class Grid {
  constructor(row, column) {
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
}
