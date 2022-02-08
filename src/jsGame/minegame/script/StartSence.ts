import { BaseSence } from "../../gamebase/BaseSence";
import { GameObject } from "../../gamebase/GameObject";
import { DEVICE_MOBILE, Game } from "../../gamebase/Game";
import { Head } from "./Head";
import { basis, middle, middle_m, MineSence, professional, professional_m } from "./MineSence";
import { Button } from "./Button";

export class StartSence extends BaseSence {
  constructor(game: Game) {
    super(game);
    this.setup();
  }

  setup() {
    let bg = GameObject.new(this.game, this, "bg");
    let head = Head.new(this.game, this);
    this.addElement(bg);
    this.addElement(head);

    let btnMiddleLevel = Button.new(this.game, this, "中级");
    btnMiddleLevel.x = this.game.area.width / 2;
    btnMiddleLevel.y = this.game.area.height / 2;
    this.addElement(btnMiddleLevel);
    btnMiddleLevel.onClick = () => {
      let ms = new MineSence(this.game, this.game.device === DEVICE_MOBILE ? middle_m : middle)
      this.game.setSence(ms)
    }
    // btnMiddleLevel.onTouchStart = () => {
    //   let ms = new MineSence(this.game, middle_m)
    //   this.game.setSence(ms)
    // }

    let btnBasisLevel = Button.new(this.game, this, "初级");
    btnBasisLevel.x = this.game.area.width / 2;
    btnBasisLevel.y = this.game.area.height / 2 - btnMiddleLevel.h;
    this.addElement(btnBasisLevel);
    btnBasisLevel.onClick = () => {
      let ms = new MineSence(this.game, basis)
      this.game.setSence(ms)
    }

    let btnProLevel = Button.new(this.game, this, "专家");
    btnProLevel.x = this.game.area.width / 2;
    btnProLevel.y = this.game.area.height / 2 + btnMiddleLevel.h;
    this.addElement(btnProLevel);
    btnProLevel.onClick = () => {
      let ms = new MineSence(this.game, this.game.device === DEVICE_MOBILE ? professional_m : professional)
      this.game.setSence(ms)
    }
  }
}
