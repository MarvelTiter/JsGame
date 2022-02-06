import { BaseSence } from "../../gamebase/BaseSence";
import { Game } from "../../gamebase/Game";
import { GameObject } from "../../gamebase/GameObject";

export class Button extends GameObject {
  text: string;
  // buttonWidth: number;
  // buttonHeight: number;
  // buttonX: number;
  // buttonY: number;
  // click: Function | undefined;
  constructor(game: Game, sence: BaseSence, text: string) {
    super(game, sence, "button");
    this.text = text;
    // this.buttonWidth = this.texture?.width ?? 0;
    // this.buttonHeight = this.texture?.height ?? 0;
    // this.w = 1200;
    // this.h = 800;
  }
  draw() {
    let ctx = this.game.context;
    let x = this.x + this.offsetX;
    let y = this.y + this.offsetY;
    // ctx.fillStyle = "rgba(0,0,0,0.3)";
    // ctx.fillRect(x, y, this.w, this.h);
    ctx.drawImage(this.texture, x, y, this.w, this.h);
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "24px serif";
    ctx.fillText(this.text, x + this.w / 2, y + this.h / 2);
  }
}
