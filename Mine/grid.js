class Grid extends Element {
  constructor(game, sence, row, column, maxCount) {
    super(game, sence);
    this.data = [];
    this.row = row;
    this.column = column;
    this.w = column * 25;
    this.h = row * 25;
    this.offsetX = (1200 - column * 25) / 2;
    this.offsetY = (800 - row * 25) / 2;
    this.mineCount = maxCount;
    for (let r = 0; r < row; r++) {
      let row = [];
      for (let c = 0; c < column; c++) {
        let cell = Cell.new(game, this.sence, this, r, c);
        cell.offsetX = this.offsetX;
        cell.offsetY = this.offsetY;
        row.push(cell);
        this.sence.addElement(cell);
      }
      this.data.push(row);
    }
    this.initMine();
    this.setupEvent();
  }
  setupEvent() {
    this.sence.registerMouseAction(MOUSE_MOVING, (e) => {
      this.handleMousemove(e);
    });
    this.sence.registerMouseAction(MOUSE_RELEASE, (e) => {
      this.handleMouseup(e);
    });
    this.sence.registerKeyAction(
      "a",
      (e) => {
        this.randomOpen();
      },
      true,
    );
    this.sence.registerKeyAction(
      "f",
      (e) => {
        let i = Item.new(this.game, this.sence);
        this.sence.addElement(i);
      },
      true,
    );
  }

  initMine() {
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

  openAll() {
    for (let r = 0; r < this.row; r++) {
      for (let c = 0; c < this.column; c++) {
        let cell = this.data[r][c];
        cell.isOpen = true;
      }
    }
  }

  handleMousemove(e) {
    let { offsetX, offsetY } = e;
    for (let r = 0; r < this.row; r++) {
      for (let c = 0; c < this.column; c++) {
        let temp = this.data[r][c];
        temp.checkFocu(offsetX, offsetY);
      }
    }
  }

  handleMouseup(e) {}

  onClick(e) {
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
          this.invokeCallback();
        }
      }
      // 0,3 double
      else if (buttons == 2) {
        temp.scan();
      }
    }
  }

  draw() {
    this.game.context.fillStyle = "rgba(0,0,0,0)";
    console.log("grid");
    this.game.context.fillRect(
      this.x + this.offsetX,
      this.y + this.offsetY,
      this.w,
      this.h,
    );
  }
}
