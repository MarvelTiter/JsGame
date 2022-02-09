import { BaseSence } from "./BaseSence";
import { Game } from "./Game";
import { GameEntity } from "./GameEntity";
import { FrameDefinition } from "./FrameDefinition";

/**
 * 动画对象
 */
export class AnimaObject extends GameEntity {
  frames: FrameDefinition[];
  frameIndex: number = 0;
  frameInterval: number = 5;
  protected frameCooldown: number = 0;
  protected playTimes: number = 0;
  constructor(
    game: Game,
    sence: BaseSence,
    name: string,
    frames: FrameDefinition[],
  ) {
    super(game, sence, name);
    this.frames = frames;
  }
  updateRequest(): boolean {
    return true;
  }

  private calcFrameIndex(): number {
    if (this.frameIndex === this.frames.length - 1) {
      this.playTimes++;
    }
    return (this.frameIndex + 1) % this.frames.length;
  }

  update(): void {
    if (this.frameCooldown !== 0) {
      this.frameCooldown--;
      return;
    }
    this.frameIndex = this.calcFrameIndex();
    this.frameCooldown = this.frameInterval;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    let f = this.frames[this.frameIndex];
    ctx.drawImage(
      this.image.texture,
      f.x,
      f.y,
      f.w,
      f.h,
      this.pos.x + this.offset.x,
      this.pos.y + this.offset.y,
      this.size.w,
      this.size.h,
    );
  }
}
