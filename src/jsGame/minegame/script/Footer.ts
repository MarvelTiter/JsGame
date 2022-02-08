import { BaseSence } from "../../gamebase/BaseSence";
import { Game } from "../../gamebase/Game";
import { TextElement } from "../../gamebase/TextElement";


export class Footer extends TextElement {
  public mineCount: number;
  public time: string;
  constructor(game: Game, sence: BaseSence) {
    super(game, sence);
    this.mineCount = 0;
    this.w = this.game.area.width;
    this.h = 50;
    this.y = this.game.area.height - 50;
    this.time = "";
    this.font = "36px serif";
  }
  update() {
    this.text = `雷:${this.mineCount}  计时:${this.time}`;
  }
}
