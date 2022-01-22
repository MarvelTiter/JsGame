class MineSence extends BaseSence {
  constructor(game) {
    super(game);
    this.row = 10
    this.column = 10
    this.setup();
  }
  setup() {
    // this.grid = new Grid(this.game, 10, 10);
    let bg = new Element(this.game, "bg");
    this.addElement(bg);
    // this.addElement(this.grid);
    this.data = [];
    for (let r = 0; r < this.row; r++) {
      let row = [];
      for (let c = 0; c < this.column; c++) {
        let cell = new Cell(this.game, r, c);
        row.push(cell);
        this.addElement(cell);
      }
      this.data.push(row);
    }
  }
}

const colorMap = {
  1: "rgb(0,255,0)",
  2: "rgb(0,0,255)",
};
