import { BaseSence } from "./BaseSence";
import { GameObject } from "./GameObject";
import { Game } from "./Game";

export class TextElement extends GameObject {
  background: string;
  font: string | undefined;
  color: string;
  text: string | undefined;
  constructor(game: Game, sence: BaseSence) {
    super(game, sence);
    this.background = "#FFA500";
    this.color = "black";
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
