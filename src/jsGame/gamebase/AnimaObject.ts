import { BaseSence } from "./BaseSence";
import { Game } from "./Game";
import { GameObject } from "./GameObject";
import { FrameDefinition } from "./FrameDefinition";

export class AnimaObject extends GameObject {
  frames: FrameDefinition[];
  frameIndex: number = 0;
  frameInterval: number = 5;
  protected frameCooldown: number = 0;
  protected playTimes: number = 0
  constructor(
    game: Game,
    sence: BaseSence,
    name: string,
    frames: FrameDefinition[]
  ) {
    super(game, sence, name);
    this.frames = frames;
  }
  updateRequest(): boolean {
    return true;
  }

  private calcFrameIndex(): number {
    if (this.frameIndex === this.frames.length - 1) {
      this.playTimes++
      console.log(this.playTimes);
    }
    return (this.frameIndex + 1) % this.frames.length
  }

  update(): void {
    if (this.frameCooldown !== 0) {
      this.frameCooldown--;
      return;
    }
    this.frameIndex = this.calcFrameIndex();
    this.frameCooldown = this.frameInterval;
  }

  draw(): void {
    let f = this.frames[this.frameIndex];
    this.game.context.drawImage(
      this.image?.texture,
      f.x,
      f.y,
      f.w,
      f.h,
      this.x + this.offsetX,
      this.y + this.offsetY,
      this.w,
      this.h
    );
  }
}
