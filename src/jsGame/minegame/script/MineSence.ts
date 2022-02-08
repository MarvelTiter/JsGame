import { BaseSence } from "../../gamebase/BaseSence";
import { GameObject } from "../../gamebase/GameObject";
import { Game } from "../../gamebase/Game";
import { Head } from "./Head";
import { Footer } from "./Footer";
import { Grid } from "./Grid";
import { Button } from "./Button";
import { StartSence } from "./StartSence";
interface MineMapSize {
  row: number
  column: number
  mineCount: number
}
export const basis = {
  row: 10,
  column: 10,
  mineCount: 10,
}

export const middle = {
  row: 16,
  column: 16,
  mineCount: 40,
}

export const professional = {
  row: 16,
  column: 30,
  mineCount: 99,
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
      this.level.row,
      this.level.column,
      this.level.mineCount,
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
    restartButton.x = this.game.area.width - restartButton.w / 2 - 20;
    restartButton.y = this.game.area.height - restartButton.h / 2 - 20;
    restartButton.canDraw = () => {
      return grid.gameOver;
    };
    restartButton.onClick = () => {
      this.game.setSence(new StartSence(this.game));
    };
    this.addElement(restartButton);
  }
}
