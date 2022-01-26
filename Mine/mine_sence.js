class MineSence extends BaseSence {
  constructor(game) {
    super(game);
    this.row = 24;
    this.column = 40;
    this.maxCount = 99;
    this.setup();
  }
  setup() {
    let bg = Element.new(this.game, this, "bg");
    let head = Head.new(this.game, this);
    let footer = Footer.new(this.game, this);
    this.addElement(bg);
    this.addElement(head);
    this.addElement(footer);
    this.grid = new Grid(this.game, this, this.row, this.column, this.maxCount);
    footer.mineCount = this.maxCount;
    this.grid.registerAction((g) => {
      footer.mineCount = g.mineCount;
    });
    this.addElement(this.grid);
  }
}
