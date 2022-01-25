class Head extends Element {
  constructor(game, sence) {
    super(game, sence);
  }
  draw() {
    let ctx = this.game.context;
    ctx.fillStyle = "#FFA500";
    ctx.fillRect(0, 0, 700, 50);
    ctx.font = "40px serif";
    ctx.fillStyle = "black";
    ctx.fillText("是兄弟就来扫雷！", 200, 40);
  }
}

class Footer extends Element {
  constructor(game, sence) {
    super(game, sence);
    this.mineCount = 0;
  }

  draw() {
    let ctx = this.game.context;
    ctx.fillStyle = "#FFA500";
    ctx.fillRect(0, 650, 700, 50);
    ctx.font = "40px serif";
    ctx.fillStyle = "black";
    ctx.fillText(`雷:${this.mineCount}`, 300, 685);
  }
}

class Item extends Element {
  constructor(game, sence) {
    super(game, sence);
    this.x = 100;
  }
  updateRequest() {
    return true;
  }
  update() {
    this.y++;
  }
  draw() {
    let ctx = this.game.context;
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, 50, 50);
    ctx.font = "14px serif";
    ctx.fillStyle = "black";
    ctx.fillText(`道具`, this.x, this.y + 30);
  }
}
