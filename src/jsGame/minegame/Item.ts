import { BaseSence } from "../gamebase/BaseSence";
import { GameObject } from "../gamebase/GameObject";
import { Game } from "../gamebase/Game";


export class Item extends GameObject {
  // static new(game: Game, sence: BaseSence) {
  //   throw new Error("Method not implemented.");
  // }
  constructor(game: Game, sence: BaseSence) {
    super(game, sence, undefined);
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
