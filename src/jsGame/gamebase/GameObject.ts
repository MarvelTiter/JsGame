import { BaseSence } from "./BaseSence";
import { Game } from "./Game";
import { GameImage } from "./Source";

function observe(data: any) {
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

export class GameObject {
  game: Game;
  sence: BaseSence;
  image: GameImage | undefined;
  x: number;
  y: number;
  w: number;
  h: number;
  focus: boolean;
  offsetX: number;
  offsetY: number;
  hasChanged: boolean;
  onTick: Function | undefined;
  constructor(game: Game, sence: BaseSence, name?: string) {
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

    if (name !== undefined) {
      this.image = game.getTextureByName(name);
      this.w = this.image.w;
      this.h = this.image.h;
    }
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
  canDraw(): boolean {
    return true;
  }
  updateRequest() {
    return this.hasChanged;
  }

  onClick(e: MouseEvent) {}
  onMouseOver(e: MouseEvent) {}
  // 子类复写
  update() {}

  // 子类复写
  draw() {
    if (this.image !== undefined) {
      this.game.context.drawImage(
        this.image.texture,
        this.x + this.offsetX,
        this.y + this.offsetY,
        this.w,
        this.h,
      );
    }
  }

  // sence调用
  elementUpdate() {
    if (!this.updateRequest()) return;
    this.update();
    if (this.onTick) this.onTick(this);
    this.hasChanged = false;
  }

  // sence调用
  elementDraw() {
    if (!this.canDraw()) return;
    this.draw();
  }
}

