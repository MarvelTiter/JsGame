class Cell extends Element {
  constructor(game, grid, rowIndex, columnIndex) {
    super(game);
    this.gutter = 0;
    this.grid = grid;
    this.row = rowIndex;
    this.column = columnIndex;
    this.flag = 0;
    this.texture = this.game.getTextureByName("normal");
    this.w = 50;
    this.h = 50;
    this.x = this.column * this.w + (this.column + 1) * this.gutter;
    this.y = this.row * this.h + (this.row + 1) * this.gutter;
    this.isOpen = false;
    this.focus = false;
    this.isMine = false;
    // this.scaning = false;
    this.count = 0;
  }

  checkFocu(x, y) {
    this.focus =
      x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
  }

  setTexture(name) {
    this.texture = this.game.getTextureByName(name);
  }

  updateState() {
    this.flag = (this.flag + 1) % 3;
  }

  update() {
    // 设置材质
    if (!this.isOpen) {
      if (this.flag == 0) {
        // if (this.scaning) {
        //   this.setTexture("n0");
        // } else {
        // }
        this.focus ? this.setTexture("over") : this.setTexture("normal");
      } else {
        let name = "";
        if (this.flag == 1) {
          name = "flag";
        } else if (this.flag == 2) {
          name = "unknow";
        } else {
          name = "normal";
        }
        this.setTexture(name);
      }
    } else {
      if (this.isMine) {
        this.setTexture("mineFail");
      } else {
        this.setTexture("n" + this.count);
      }
    }

    if (!this.game.mouseAction.enable) return;
    let { offsetX, offsetY } = this.game.mouseAction.mouseArgs;
    this.checkFocu(offsetX, offsetY);

    let ma = this.game.mouseAction;
    // if (ma.type != "move") {
    // }
    if (!ma.handled && this.focus) {
      let { button, buttons } = ma.mouseArgs;
      if (ma.status == MOUSE_PRESS) {
        // 0,1 left
        if (button == 0 && buttons == 1) {
          this.grid.open(this);
        }
        // 2,2 right
        if (button == 2 && buttons == 2) {
          this.updateState();
        }
        // 0,3 double
        if (button == 0 && buttons == 3) {
          this.grid.scan(this);
        }
        ma.handled = true;
      } else if (ma.status == MOUSE_RELEASE) {
        this.grid.release(this);
      }
    }
  }
}
