import { BaseSence } from "../../gamebase/BaseSence";
import { GameObject } from "../../gamebase/GameObject";
import { Game } from "../../gamebase/Game";
import { Head } from "./Head";
import { MineSence } from "./MineSence";
import { Button } from "./Button";

export class StartSence extends BaseSence {
  constructor(game: Game) {
    super(game);
    this.setup();
  }

  setup() {
    let bg = GameObject.new(this.game, this, "bg");
    let head = Head.new(this.game, this);
    let button = Button.new(this.game, this, "开始游戏");
    button.x = (1200 - button.w) / 2;
    button.y = (800 - button.h) / 2;
    this.addElement(bg);
    this.addElement(head);
    this.addElement(button);

    button.onClick = ()=>{
      let ms = new MineSence(this.game)
      this.game.setSence(ms)
    }

  }
}
