class TextElement extends Element {
    constructor(game, sence) {
      super(game, sence);
      this.background = "#FFA500";
      this.font = null;
      this.color = "black";
      this.text = null;
    }
  
    draw() {
      let ctx = this.game.context;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = this.background;
      ctx.fillRect(this.x, this.y, this.w, this.h);
      if (this.font) ctx.font = this.font;
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.w / 2, this.y + this.h / 2);
    }
  }
