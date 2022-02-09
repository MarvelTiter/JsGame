import { BaseSence } from "../../gamebase/BaseSence";
import { Game } from "../../gamebase/Game";
import { TextObject } from "../../gamebase/TextObject";

export class Head extends TextObject {
  constructor(game: Game, sence: BaseSence) {
    super(game, sence);
    this.size.w = this.game.getWidth();
    this.size.h = 50;
    this.text = "是兄弟就来扫雷！";
    this.font = "36px serif";
  }
}


