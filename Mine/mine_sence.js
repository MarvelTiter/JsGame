class MineSence {
  constructor(game) {
    this.game = game;
    this.setup();
  }
  setup() {
    this.data = [];
    for (let r = 0; r < 10; r++) {
      let row = [];
      for (let c = 0; c < 10; c++) {
        let cell = new Cell(this.game, r, c);
        row.push(cell);
      }
      this.data.push(row);
    }
  }

  update() {}

  draw() {
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        let cell = this.data[r][c];
        cell.draw();
      }
    }
  }
}

class Cell {
  constructor(game, rowIndex, columnIndex) {
    this.game = game;
    this.width = 50;
    this.gutter = 10;
    this.row = rowIndex;
    this.column = columnIndex;
    this.x = this.column * this.width + (this.column + 1) * this.gutter;
    this.y = this.row * this.width + (this.row + 1) * this.gutter;
    this.color = "rgba(0, 0, 200, 0.5)";
    this.flag = 0;
    this.focus = false;
    this.onclick = this.updateState
    this.onmousemove = this.checkFocu
  }

  checkFocu(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    // console.log(this)
    this.focus =
      x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + this.width;
    this.changed = this.focus;
  }

  updateState() {
    this.flag = (this.flag + 1) % 3;
  }

  getColor() {
    if (this.flag > 0) {
      return colorMap[this.flag];
    }
    return this.focus ? "rgb(200,0,0)" : "rgba(0, 0, 200, 0.5)";
  }

  draw() {
    this.game.context.fillStyle = this.getColor();
    this.game.context.fillRect(this.x, this.y, this.width, this.width);
  }
}
const colorMap = {
  1: "rgb(0,255,0)",
  2: "rgb(0,0,255)",
};
