import { BaseSence } from "./BaseSence";
import { Game } from "./Game";
import { MouseArgs } from "./MouseArgs";
export function observe(data: any) {
  if (!data || typeof data !== "object") {
    return;
  }
  // 取出所有属性遍历
  Object.keys(data).forEach((key) => {
    if (key == "hasChanged") return;
    defineProp(data, key, data[key]);
  });
}
function defineProp(data: any, key: string, childVal: any) {
  // observe(childVal); //监听子属性
  Object.defineProperty(data, key, {
    set: (newVal) => {
      data.hasChanged = true;
      childVal = newVal;
    },
    get: () => {
      return childVal;
    },
    enumerable: true, // 可枚举
    configurable: false, // 不能再define
  });
}
/**
 * 所有对象的基类
 */
export class GameObject {
  game: Game;
  sence: BaseSence;
  x: number;
  y: number;
  w: number;
  h: number;
  focus: boolean;
  offsetX: number;
  offsetY: number;
  hasChanged: boolean;
  onTick: Function | undefined;
  constructor(game: Game, sence: BaseSence) {
    this.game = game;
    this.sence = sence;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.focus = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.hasChanged = true;
  }
  static new<T extends GameObject>(...args: any[]): T {
    let i = Reflect.construct(this, args);
    observe(i);
    return i;
  }

  checkFocu(x: number, y: number) {
    let isfocus =
      x - this.offsetX > this.x &&
      x - this.offsetX < this.x + this.w &&
      y - this.offsetY > this.y &&
      y - this.offsetY < this.y + this.h;
    if (isfocus !== this.focus) {
      this.focus = isfocus;
    }
    return this.focus;
  }

  onClick(e: MouseArgs) { }
  onMouseOver(e: MouseArgs) { }
  onMouseUp() { }
  onTouchStart(e: MouseArgs) {
    this.onClick(e);
  }
  onTouchMove(e: MouseArgs) { }
  onTouchEnd() { }
  canDraw(): boolean {
    return true;
  }
  updateRequest() {
    return this.hasChanged;
  }
  // 子类复写
  update() { }

  // 子类复写
  draw(ctx: CanvasRenderingContext2D) { }

  // sence调用
  elementUpdate() {
    if (!this.updateRequest())
      return;
    this.update();
    if (this.onTick)
      this.onTick(this);
    this.hasChanged = false;
  }

  // sence调用
  elementDraw(ctx: CanvasRenderingContext2D) {
    if (!this.canDraw())
      return;
    this.draw(ctx);
  }
}
