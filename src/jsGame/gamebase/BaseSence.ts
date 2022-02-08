import { Game, MOUSE_MOVING, MOUSE_PRESS, MOUSE_RELEASE } from "./Game";
import { GameObject } from "./GameObject";

export class BaseSence {
  game: Game;
  private elements: GameObject[];
  keys: Map<string, boolean>;
  actions: Map<string, Function>;
  onceAction: Map<string, Function>;
  mouseupEvents: Function[];
  mousedownEvents: Function[] = [];
  mousemoveEvents: Function[] = [];
  private aidElement: GameObject | undefined
  // game:Game;
  constructor(game: Game) {
    this.game = game;
    this.elements = [];
    this.keys = new Map<string, boolean>();
    this.actions = new Map<string, Function>();
    this.onceAction = new Map<string, Function>();
    this.mouseupEvents = [];
  }

  public addElement(e: GameObject): void {
    this.elements.push(e);
  }

  public removeElement(e: GameObject): void {
    let i = this.elements.indexOf(e);
    this.elements.splice(i, 1);
  }

  public handleMousevove(e: MouseEvent): void {
    let { offsetX, offsetY } = e;
    for (let index = this.elements.length - 1; index > -1; index--) {
      const element = this.elements[index];
      if (element.checkFocu(offsetX, offsetY)) {
        this.aidElement = element
        element.onMouseOver({
          button: e.button,
          buttons: e.buttons,
          x: e.offsetX,
          y: e.offsetY
        });
        break;
      }
    }
  }

  public handleMouseup(e: MouseEvent): void {
    if (this.aidElement) {
      this.aidElement.onMouseUp()
    }
    this.aidElement = undefined
  }

  public handleMousedown(e: MouseEvent): void {
    if (this.aidElement) {
      this.aidElement.onClick({
        button: e.button,
        buttons: e.buttons,
        x: e.offsetX,
        y: e.offsetY
      })
      return
    }
    let { offsetX, offsetY } = e;
    for (let index = this.elements.length - 1; index > -1; index--) {
      const element = this.elements[index];
      if (element.checkFocu(offsetX, offsetY)) {
        element.onClick({
          button: e.button,
          buttons: e.buttons,
          x: e.offsetX,
          y: e.offsetY
        });
        break;
      }
    }
  }

  public handleTouchStart(e: TouchEvent): void {
    let { clientX, clientY } = e.touches[0]
    for (let index = this.elements.length - 1; index > -1; index--) {
      const element = this.elements[index];
      if (element.checkFocu(clientX, clientY)) {
        this.aidElement = element
        element.onTouchStart({
          button: 0,
          buttons: 0,
          x: clientX,
          y: clientY
        });
        break;
      }
    }
  }

  public handleTouchEnd(e: TouchEvent): void {
    if (this.aidElement) {
      this.aidElement.onTouchEnd()
    }
    this.aidElement = undefined
  }

  public handleKeydown(e: KeyboardEvent): void {
    if (this.keys.get(e.key) == undefined) {
      return;
    }
    this.keys.set(e.key, true);
    let once = this.onceAction.get(e.key)
    if (once !== undefined) {
      once()
    }
  }

  public handleKeyup(e: KeyboardEvent): void {
    if (this.keys.get(e.key) === undefined) {
      return;
    }
    this.keys.set(e.key, false);
  }

  public registerKeyAction(key: string, callback: Function, once: boolean): void {
    this.keys.set(key, false);
    if (once) {
      this.onceAction.set(key, callback);
    } else {
      this.actions.set(key, callback);
    }
  }

  public registerMouseAction(actionType: string, callback: Function): void {
    if (actionType == MOUSE_PRESS) {
      this.mousedownEvents.push(callback);
    } else if (actionType == MOUSE_MOVING) {
      this.mousemoveEvents.push(callback);
    } else if (actionType == MOUSE_RELEASE) {
      this.mouseupEvents.push(callback);
    }
  }

  public update(): void {
    for (const actionKey of Object.keys(this.actions)) {
      if (this.keys.get(actionKey)) {
        let f = this.actions.get(actionKey)
        if (f !== undefined) f()
      }
    }
    for (const e of this.elements) {
      e.elementUpdate();
    }
  }

  public draw(): void {
    for (const e of this.elements) {
      e.elementDraw();
    }
  }
}
