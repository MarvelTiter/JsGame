import { BaseSence } from "../../gamebase/BaseSence";
import { GameObject } from "../../gamebase/GameObject";
import { Game } from "../../gamebase/Game";
import { Head } from "./Head";
import { Footer } from "./Footer";
import { Grid } from "./Grid";
import { Button } from "./Button";
import { StartSence } from "./StartSence";
import { MineMapSize } from "./config";

export const basis = {
  row: 10,
  column: 10,
  mineCount: 10,
  len: 30
}

export const middle = {
  row: 16,
  column: 16,
  mineCount: 40,
  len: 30
}



export const professional = {
  row: 16,
  column: 30,
  mineCount: 99,
  len: 30
}

export const basis_m = {
  row: 10,
  column: 12,
  mineCount: 12,
  len: 30
}

export const middle_m = {
  row: 21,
  column: 12,
  mineCount: 40,
  len: 30
}

export const professional_m = {
  row: 40,
  column: 12,
  mineCount: 99,
  len: 24
}


export class MineSence extends BaseSence {
  level: MineMapSize;
  constructor(game: Game, level: MineMapSize) {
    super(game);
    this.level = level
    this.setup();
  }
  setup() {
    let bg = GameObject.new(this.game, this, "bg");
    let head = Head.new(this.game, this) as Head;
    let footer = Footer.new(this.game, this) as Footer;
    this.addElement(bg);
    this.addElement(head);
    this.addElement(footer);
    let grid = Grid.new<Grid>(
      this.game,
      this,
      this.level
    );
    footer.mineCount = this.level.mineCount;
    grid.onFlagChanged = (g: Grid) => {
      footer.mineCount = g.mineCount - g.flagCount;
    };
    grid.onTick = (g: Grid) => {
      footer.time = g.time;
    };
    this.addElement(grid);
    // let over = GameOverDialog.new(this.game, this);
    // this.addElement(over);
    let restartButton = Button.new(this.game, this, "重新开始");
    restartButton.x = this.game.getWidth() - restartButton.w / 2 - 20;
    restartButton.y = this.game.getHeight() - restartButton.h / 2 - 20;
    restartButton.canDraw = () => {
      return grid.gameOver;
    };
    restartButton.onClick = () => {
      this.game.setSence(new StartSence(this.game));
    };
    this.addElement(restartButton);
  }
}
