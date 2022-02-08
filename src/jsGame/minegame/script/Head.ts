import { BaseSence } from "../../gamebase/BaseSence";
import { Game } from "../../gamebase/Game";
import { TextObject } from "../../gamebase/TextObject";

export class Head extends TextObject {
  constructor(game: Game, sence: BaseSence) {
    super(game, sence);
    this.w = this.game.getWidth();
    this.h = 50;
    this.y = 0;
    this.text = "是兄弟就来扫雷！";
    this.font = "36px serif";
  }
}


