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
    let grid = Grid.new(this.game, this, this.row, this.column, this.maxCount);
    footer.mineCount = this.maxCount;
    grid.onFlagChanged = (g) => {
      footer.mineCount = g.mineCount;
    };
    grid.onTick = (g) => {
      footer.time = g.time;
    };
    this.addElement(grid);

    let button = StartButton.new(this.game, this, "开始游戏", "button");
    button.click = () => {
      grid.start();
    };
    this.addElement(button);
  }
}
