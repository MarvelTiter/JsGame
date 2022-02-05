import { BaseSence } from "../gamebase/BaseSence";
import { Game } from "../gamebase/Game";
import { TextElement } from "../gamebase/TextElement";


export class Footer extends TextElement {
  public mineCount: number;
  public time: string;
  constructor(game: Game, sence: BaseSence) {
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
