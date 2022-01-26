const RESET = 0x0000;
const MOUSE_MOVE = 0x0001;
const MOUSE_LB_CLICK = 0x0010;
const MOUSE_RB_CLICK = 0x0100;
const MOUSE_MOVING = "MOVE";
const MOUSE_PRESS = "PRESS";
const MOUSE_RELEASE = "RELEASE";

class Game {
  constructor() {
    this.canvas = document.querySelector("#canvas");
    this.context = this.canvas.getContext("2d");
    this.enableMouseAction = false;
    this.images = {};
    this.sence = null;
    this.eventSetup();
  }

  eventSetup() {
    this.canvas.addEventListener("mouseover", (e) => {
      e.preventDefault();
      this.enableMouseAction = true;
    });
    this.canvas.addEventListener("mouseout", (e) => {
      e.preventDefault();
      this.enableMouseAction = false;
    });
    this.canvas.addEventListener("mousemove", (e) => {
      e.preventDefault();
      if (this.enableMouseAction && this.sence) {
        this.sence.handleMousevove(e)
      }
    });
    this.canvas.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (this.sence) {
        this.sence.handleMousedown(e)
      }
    });
    this.canvas.addEventListener("mouseup", (e) => {
      e.preventDefault();
      if (this.sence) {
        this.sence.handleMouseup(e)
      }
    });
    window.addEventListener("keydown", (e) => {
      if (this.sence) {
        this.sence.handleKeydown(e)
      }
    });
    window.addEventListener("keyup", (e) => {
      if (this.sence) {
        this.sence.handleKeyup(e)
      }
    });
    this.canvas.addEventListener("contextmenu", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

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
      this.sence.update();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.sence.draw();
    }, 1000 / 30);
  }
}
