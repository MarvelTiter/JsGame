import { BaseSence } from "./BaseSence";
import { Game } from "./Game";
import { GameObject } from "./GameObject";
import { GameImage } from "./Source";

/**
 * 有texture的Object
 */
export class GameEntity extends GameObject {
  image: GameImage;
  constructor(game: Game, sence: BaseSence, name: string) {
    super(game, sence);
    this.image = game.getTextureByName(name);
    this.size = this.image.size;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.image.texture,
      this.pos.x + this.offset.x,
      this.pos.y + this.offset.y,
      this.size.w,
      this.size.h,
    );
  }
}
