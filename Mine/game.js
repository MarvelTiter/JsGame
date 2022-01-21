class Game {
  constructor() {
    this.actions = {};
    this.cavnas = document.querySelector("#canvas");
    this.context = this.cavnas.getContext("2d");
    this.moveActions = [];
    this.moveArgs = null;
    this.sence = null;
    this.setup();
  }

  setup() {
    this.cavnas.addEventListener("mousemove", (e) => {
      this.moveArgs = e;
    });
    this.cavnas.addEventListener("click", (e) => {
      this.moveArgs = e;
    });
  }
  registerMouseAction(callbackObject, funcName) {
    this.moveActions.push({
      obj: callbackObject,
      func: funcName,
    });
  }
  registerAction(key, callback) {}

  setSence(sence) {
    this.sence = sence;
  }

  run() {
    if (!this.sence) return;
    window.setInterval(() => {
      for (const action of this.moveActions) {
        if (!this.moveArgs) continue
        let {obj,func} = action
        let { offsetX, offsetY } = this.moveArgs;
        // action({ offsetX, offsetY });
        obj[func]({ offsetX, offsetY })
      }
      this.sence.update();
      this.context.clearRect(0, 0, this.cavnas.width, this.cavnas.height);
      this.sence.draw();
    }, 1000 / 30);
  }
}
