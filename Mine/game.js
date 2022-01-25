const RESET = 0x0000;
const MOUSE_MOVE = 0x0001;
const MOUSE_LB_CLICK = 0x0010;
const MOUSE_RB_CLICK = 0x0100;
const MOUSE_MOVING = "MOVE";
const MOUSE_PRESS = "PRESS";
const MOUSE_RELEASE = "RELEASE";

class Game {
  constructor() {
    this.keys = {};
    this.actions = {};
    this.onceAction = {};
    this.canvas = document.querySelector("#canvas");
    this.context = this.canvas.getContext("2d");
    this.images = {};
    this.enableMouseAction = false;
    this.mousedownEvents = [];
    this.mousemoveEvents = [];
    this.mouseupEvents = [];
    this.sence = null;
    this.setup();
  }

  setup() {
    this.canvas.addEventListener("mouseover", (e) => {
      e.preventDefault();
      this.enableMouseAction = true;
    });
    this.canvas.addEventListener("mousemove", (e) => {
      e.preventDefault();
      if (this.enableMouseAction) {
        for (const event of this.mousemoveEvents) {
          if (this.enableMouseAction) {
            event(e);
          }
        }
      }
    });
    this.canvas.addEventListener("mouseout", (e) => {
      e.preventDefault();
      this.enableMouseAction = false;
    });
    this.canvas.addEventListener("mousedown", (e) => {
      e.preventDefault();
      for (const event of this.mouseupEvents) {
        event(e);
      }
    });
    this.canvas.addEventListener("mouseup", (e) => {
      e.preventDefault();
      for (const event of this.mousedownEvents) {
        event(e);
      }
    });
    this.canvas.addEventListener("contextmenu", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
      if (this.onceAction[e.key]) this.onceAction[e.key]();
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });
  }

  registerKeyAction(key, callback, once) {
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

  loadSources(sources) {
    let game = this;
    let count = 0;
    return new Promise((resolve, reject) => {
      let keys = Object.keys(sources);
      for (const i of keys) {
        let img = new Image();
        img.src = sources[i];
        img.onload = () => {
          this.images[i] = img;
          count++;
          if (count == keys.length) {
            resolve(game);
          }
        };
      }
    });
  }

  getTextureByName(name) {
    return this.images[name];
  }

  setSence(sence) {
    this.sence = sence;
  }

  run() {
    if (!this.sence) return;
    window.setInterval(() => {
      for (const actionKey of Object.keys(this.actions)) {
        if (this.keys[actionKey]) {
          this.actions[actionKey]();
        }
      }
      this.sence.update();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.sence.draw();
    }, 1000 / 30);
  }
}
