class BaseSence {
  constructor(game) {
    this.game = game
    this.elements = [];
    this.keys = {};
    this.actions = {};
    this.onceAction = {};
    this.mousedownEvents = [];
    this.mousemoveEvents = [];
    this.mouseupEvents = [];
  }

  addElement(e) {
    this.elements.push(e);
  }

  handleMousevove(e) {
    for (const event of this.mousemoveEvents) {
      event(e);
    }
  }

  handleMouseup(e) {
    for (const event of this.mouseupEvents) {
      event(e);
    }
  }

  handleMousedown(e) {
    for (const event of this.mousedownEvents) {
      event(e);
    }
  }

  handleKeydown(e) {
    if (this.keys[e.key] == undefined) {
      return
    }
    this.keys[e.key] = true;
    if (this.onceAction[e.key]) this.onceAction[e.key]();
  }

  handleKeyup(e) {
    if (this.keys[e.key] == undefined) {
      return
    }
    this.keys[e.key] = false;
  }


  registerKeyAction(key, callback, once) {
    this.keys[key] = false
    if (once) {
      this.onceAction[key] = callback;
    } else {
      this.actions[key] = callback;
    }
  }

  registerMouseAction(actionType, callback) {
    if (actionType == MOUSE_PRESS) {
      this.mousedownEvents.push(callback);
    } else if (actionType == MOUSE_MOVING) {
      this.mousemoveEvents.push(callback);
    } else if (actionType == MOUSE_RELEASE) {
      this.mouseupEvents.push(callback);
    }
  }

  update() {
    for (const actionKey of Object.keys(this.actions)) {
      if (this.keys[actionKey]) {
        this.actions[actionKey]();
      }
    }
    for (const e of this.elements) {
      e.elementUpdate();
    }
  }

  draw() {
    for (const e of this.elements) {
      e.elementDraw();
    }
  }
}
