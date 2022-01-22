class Cell extends Element {
  constructor(game, rowIndex, columnIndex) {
    super(game);
    this.gutter = 0;
    this.row = rowIndex;
    this.column = columnIndex;
    this.color = "rgba(0, 0, 255, 1)";
    this.flag = 0;
    this.texture = this.game.getTextureByName("normal");
    this.w = 50;
    this.h = 50;
    this.x = this.column * this.w + (this.column + 1) * this.gutter;
    this.y = this.row * this.h + (this.row + 1) * this.gutter;
    this.isOpen = false;
    this.focus = false;
  }

  checkFocu(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    this.focus =
      x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
  }

  updateState() {
    this.flag = (this.flag + 1) % 3;
  }

  update() {
    if (!this.game.mouseAction.mouseArgs) return;
    let { offsetX, offsetY } = this.game.mouseAction.mouseArgs;
    this.checkFocu({ offsetX, offsetY });

    if (!this.game.mouseAction.clickHandled && this.focus) {
      this.updateState();
      this.game.mouseAction.clickHandled = true;
    }

    if (!this.isOpen && this.flag == 0) {
      this.texture = this.focus
        ? this.game.getTextureByName("over")
        : this.game.getTextureByName("normal");
    } else if (!this.isOpen && this.flag > 0) {
      let name = "";
      if (this.flag == 1) {
        name = "flag";
      } else if (this.flag == 2) {
        name = "unknow";
      } else {
        name = "normal";
      }
      this.texture = this.game.getTextureByName(name);
    }
  }
}
