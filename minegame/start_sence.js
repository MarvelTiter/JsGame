class StartSence extends BaseSence {
  constructor(game) {
    super(game);
    this.setup();
  }

  setup() {
    let bg = Element.new(this.game, this, "bg");
    let head = Head.new(this.game, this);
    let button = StartButton.new(this.game, this, "开始游戏", "button");
    button.x = (1200 - button.w) / 2;
    button.y = (800 - button.h) / 2;
    this.addElement(bg);
    this.addElement(head);
    this.addElement(button);
  }
}

class StartButton extends Element {
  constructor(game, sence, text, texture) {
    super(game, sence, texture);
    this.text = text;
    this.buttonWidth = this.texture.width;
    this.buttonHeight = this.texture.height;
    this.w = 1200;
    this.h = 800;
    this.buttonX = (1200 - this.buttonWidth) / 2;
    this.buttonY = (800 - this.buttonHeight) / 2;
    this.click = null
  }

  onClick(e) {
    let { offsetX, offsetY } = e;
    if (
      offsetX > this.buttonX &&
      offsetX < this.buttonX + this.buttonWidth &&
      offsetY > this.buttonY &&
      offsetY < this.buttonY + this.buttonHeight
    ) {
      if (this.click) this.click()
      this.sence.removeElement(this);      
    }
  }
  draw() {
    let ctx = this.game.context;
    let x = this.buttonX + this.offsetX;
    let y = this.buttonY + this.offsetY;
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.drawImage(this.texture, x, y, this.buttonWidth, this.buttonHeight);
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "24px serif";
    ctx.fillText(
      this.text,
      x + this.buttonWidth / 2,
      y + this.buttonHeight / 2,
    );
  }
}
