import { BaseSence } from "../gamebase/BaseSence";
import { GameObject } from "../gamebase/GameObject";
import { Game } from "../gamebase/Game";
import { Head } from "./Head";
import { Footer } from "./Footer";
import { Grid } from "./Grid";
import { StartButton } from "./StartButton";

export class MineSence extends BaseSence {
  row: number;
  column: number;
  maxCount: number;
  constructor(game: Game) {
    super(game);
    this.row = 24;
    this.column = 40;
    this.maxCount = 99;
    this.setup();
  }
  setup() {
    let bg = GameObject.new(this.game, this, "bg");
    let head = Head.new(this.game, this) as Head;
    let footer = Footer.new(this.game, this) as Footer;
    this.addElement(bg);
    this.addElement(head);
    this.addElement(footer);
    let grid = Grid.new<Grid>(this.game, this, this.row, this.column, this.maxCount);
    footer.mineCount = this.maxCount;
    grid.onFlagChanged = (g: Grid) => {
      footer.mineCount = g.mineCount;
    };
    grid.onTick = (g: Grid) => {
      footer.time = g.time;
    };
    this.addElement(grid);

    let button = new StartButton(this.game, this, "开始游戏", "button");
    button.click = () => {
      grid.start();
    };
    this.addElement(button);
  }
}
