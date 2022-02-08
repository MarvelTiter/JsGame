import { Game } from "./Game";
import { GameObject } from "./GameObject";
export interface ObjectAction {
  callBack: () => void;
  invoker: GameObject;
}
/**
 * 场景基类，
 * 负责渲染场景元素，
 * 注册、分发事件
 */
export class BaseSence {
  game: Game;
  private elements: GameObject[];
  keys: Map<string, boolean>;
  actions: Map<string, ObjectAction>;
  onceAction: Map<string, ObjectAction>;
  mouseupEvents: Function[];
  mousedownEvents: Function[] = [];
  mousemoveEvents: Function[] = [];
  private aidElement: GameObject | undefined;
  // game:Game;
  constructor(game: Game) {
    this.game = game;
    this.elements = [];
    this.keys = new Map<string, boolean>();
    this.actions = new Map<string, ObjectAction>();
    this.onceAction = new Map<string, ObjectAction>();
    this.mouseupEvents = [];
  }

  public addElement<T extends GameObject>(e: T): void {
    this.elements.push(e);
  }

  public removeElement<T extends GameObject>(e: T): void {
    let i = this.elements.indexOf(e);
    this.elements.splice(i, 1);
  }

  public handleMousemove(e: MouseEvent): void {
    let { offsetX, offsetY } = e;
    for (let index = this.elements.length - 1; index > -1; index--) {
      const element = this.elements[index];
      if (element.checkFocu(offsetX, offsetY)) {
        this.aidElement = element;
        element.onMouseOver({
          button: e.button,
          buttons: e.buttons,
          x: e.offsetX,
          y: e.offsetY,
        });
        break;
      }
    }
  }

  public handleMouseup(e: MouseEvent): void {
    this.aidElement?.onMouseUp();
    this.aidElement = undefined;
  }

  public handleMousedown(e: MouseEvent): void {
    if (this.aidElement) {
      this.aidElement.onClick({
        button: e.button,
        buttons: e.buttons,
        x: e.offsetX,
        y: e.offsetY,
      });
      return;
    }
    let { offsetX, offsetY } = e;
    for (let index = this.elements.length - 1; index > -1; index--) {
      const element = this.elements[index];
      if (element.checkFocu(offsetX, offsetY)) {
        element.onClick({
          button: e.button,
          buttons: e.buttons,
          x: e.offsetX,
          y: e.offsetY,
        });
        break;
      }
    }
  }

  public handleTouchStart(e: TouchEvent): void {
    let { pageX, pageY } = e.touches[0];
    for (let index = this.elements.length - 1; index > -1; index--) {
      const element = this.elements[index];
      if (element.checkFocu(pageX, pageY)) {
        this.aidElement = element;
        element.onTouchStart({
          button: 0,
          buttons: 0,
          x: pageX,
          y: pageY,
        });
        break;
      }
    }
  }

  public handleTouchMove(e: TouchEvent): void {
    this.aidElement?.onTouchMove({
      button: 0,
      buttons: 0,
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    });
    this.aidElement = undefined;
  }

  public handleTouchEnd(e: TouchEvent): void {
    this.aidElement?.onTouchEnd();
    this.aidElement = undefined;
  }

  public handleKeydown(e: KeyboardEvent): void {
    if (this.keys.get(e.key) == undefined) {
      return;
    }
    this.keys.set(e.key, true);
    let once = this.onceAction.get(e.key);
    if (once !== undefined) {
      once.callBack.apply(once.invoker);
    }
  }

  public handleKeyup(e: KeyboardEvent): void {
    if (this.keys.get(e.key) === undefined) {
      return;
    }
    this.keys.set(e.key, false);
  }

  /**
   * 注册按键处理函数
   * @param key 按下的键
   * @param element 函数调用的对象(函数内部有this)
   * @param callback 按键回调函数
   * @param once 是否按下弹起就触发一次的事件
   */
  public registerKeyAction(
    key: string,
    element: GameObject,
    callback: () => void,
    once: boolean,
  ): void {    
    this.keys.set(key, false);
    if (once) {
      this.onceAction.set(key, {
        invoker: element,
        callBack: callback,
      });
    } else {
      this.actions.set(key, {
        invoker: element,
        callBack: callback,
      });
    }
  }

  // public registerMouseAction(actionType: string, callback: Function): void {
  //   if (actionType == MOUSE_PRESS) {
  //     this.mousedownEvents.push(callback);
  //   } else if (actionType == MOUSE_MOVING) {
  //     this.mousemoveEvents.push(callback);
  //   } else if (actionType == MOUSE_RELEASE) {
  //     this.mouseupEvents.push(callback);
  //   }
  // }

  public update(): void {
    for (const actionKey of Object.keys(this.actions)) {
      if (this.keys.get(actionKey)) {
        let f = this.actions.get(actionKey);
        if (f !== undefined) {
          f.callBack.apply(f.invoker);
        }
      }
    }
    for (const e of this.elements) {
      e.elementUpdate();
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    for (const e of this.elements) {
      e.elementDraw(ctx);
    }
  }
}
