import { BaseSence } from "../gamebase/BaseSence";
import { GameObject } from "../gamebase/GameObject";
import { Game } from "../gamebase/Game";
import { StartButton } from "./StartButton";
import { Head } from "./Head";

export class StartSence extends BaseSence {
  constructor(game:Game) {
    super(game);
    this.setup();
  }

  setup() {
    let bg = GameObject.new(this.game, this, "bg");
    let head = Head.new(this.game, this);
    let button = StartButton.new(this.game, this, "开始游戏", "button");
    button.x = (1200 - button.w) / 2;
    button.y = (800 - button.h) / 2;
    this.addElement(bg);
    this.addElement(head);
    this.addElement(button);
  }
}


