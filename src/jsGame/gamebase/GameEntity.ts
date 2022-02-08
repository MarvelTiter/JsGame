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
    this.w = this.image.w;
    this.h = this.image.h;
  }  

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.image.texture,
      this.x + this.offsetX,
      this.y + this.offsetY,
      this.w,
      this.h,
    );
  }
}
