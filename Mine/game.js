const RESET = 0x0000;
const MOUSE_MOVE = 0x0001;
const MOUSE_LB_CLICK = 0x0010;
const MOUSE_RB_CLICK = 0x0100;
const MOUSE_MOVING = "MOVE";
const MOUSE_PRESS = "PRESS";
const MOUSE_RELEASE = "RELEASE";
class Game {
  constructor() {
    this.actions = {};
    this.cavnas = document.querySelector("#canvas");
    this.context = this.cavnas.getContext("2d");
    this.images = {};
    this.mouseAction = {
      // buttons: 0x000,
      enable: false,
      mouseArgs: null,
      handled: true,
    };
    this.moveArgs = null;
    this.sence = null;
    this.setup();
    this.timerId = null;
  }

  setup() {
    this.cavnas.addEventListener("mouseover", (e) => {
      this.mouseAction.enable = true;
    });
    this.cavnas.addEventListener("mousemove", (e) => {
      if (this.mouseAction.enable) {
        // if (Math.abs(e.movementX) < 2 && Math.abs(e.movementY) < 2) {
        //   return;
        // }
        this.mouseAction.status = MOUSE_MOVING;
        this.mouseAction.mouseArgs = e;
        this.mouseAction.handled = false;
      } else {
        this.mouseAction.mouseArgs = null;
      }
    });
    this.cavnas.addEventListener("mouseout", (e) => {
      this.mouseAction.enable = false;
    });
    this.cavnas.addEventListener("mousedown", (e) => {
      let self = this;
      // let { button, buttons } = e;
      // console.log({ button, buttons });
      e.preventDefault();
      if (this.timerId) {
        clearTimeout(this.timerId);
      }
      this.timerId = setTimeout(function () {
        self.mouseAction.status = MOUSE_PRESS;
        self.mouseAction.mouseArgs = e;
        self.mouseAction.handled = false;
      }, 100);
    });
    this.cavnas.addEventListener("mouseup", (e) => {
      this.mouseAction.status = MOUSE_RELEASE;
      e.preventDefault();
    });
    this.cavnas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      // // console.log(e);
      // this.mouseAction.buttons = this.mouseAction.buttons | MOUSE_RB_CLICK;
      // this.mouseAction.mouseArgs = e;
    });
  }

  registerAction(key, callback) {}

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
      this.sence.update();
      this.context.clearRect(0, 0, this.cavnas.width, this.cavnas.height);
      this.sence.draw();
    }, 1000 / 60);
  }
}
