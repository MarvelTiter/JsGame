class Head extends TextElement {
  constructor(game, sence) {
    super(game, sence);
    this.w = 1200;
    this.h = 50;
    this.y = 0;
    this.text = "是兄弟就来扫雷！";
    this.font = "40px serif";
  }
}

class Footer extends TextElement {
  constructor(game, sence) {
    super(game, sence);
    this.mineCount = 0;
    this.w = 1200;
    this.h = 50;
    this.y = 750;
    this.time = "";
  }
  update() {
    this.text = `雷: ${this.mineCount}        计时: ${this.time}`;
  }
}

class Item extends Element {
  constructor(game, sence) {
    super(game, sence);
    this.x = 100;
    this.w = 50;
    this.h = 50;
  }
  updateRequest() {
    return true;
  }

  onClick() {
    this.x += 20;
  }

  update() {
    this.y++;
  }
  draw() {
    let ctx = this.game.context;
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.font = "14px serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`道具`, this.x + this.w / 2, this.y + this.h / 2);
  }
}
