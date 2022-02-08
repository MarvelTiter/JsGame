import { BaseSence } from "../../gamebase/BaseSence";
import { Game } from "../../gamebase/Game";
import { GameObject } from "../../gamebase/GameObject";

export class Button extends GameObject {
  text: string;
  constructor(game: Game, sence: BaseSence, text: string) {
    super(game, sence, "button");
    this.text = text;
  }
  checkFocu(x: number, y: number): boolean {
      let isfocus =
        x - this.offsetX > this.x - this.w / 2 &&
        x - this.offsetX < this.x + this.w / 2 &&
        y - this.offsetY > this.y - this.h / 2 &&
        y - this.offsetY < this.y + this.h / 2;
      if (isfocus !== this.focus) {
        this.focus = isfocus;
      }
      return this.focus;
  }
  draw() {
    let ctx = this.game.context;
    let x = this.x + this.offsetX;
    let y = this.y + this.offsetY;
    // ctx.fillStyle = "rgba(0,0,0,0.3)";
    // ctx.fillRect(x, y, this.w, this.h);
    ctx.drawImage(this.image?.texture, x - this.w / 2, y - this.h / 2, this.w, this.h);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "24px serif";
    ctx.fillText(this.text, x, y);
  }
}
