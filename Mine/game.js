class Game {
  constructor() {
    this.actions = {};
    this.cavnas = document.querySelector("#canvas");
    this.context = this.cavnas.getContext("2d");
    this.images = {};
    this.mouseAction = {
      mouseArgs: null,
      clickHandled: true,
    };
    this.moveArgs = null;
    this.sence = null;
    this.setup();
  }

  setup() {
    this.cavnas.addEventListener("mousemove", (e) => {
      this.mouseAction.mouseArgs = e;
    });
    this.cavnas.addEventListener("click", (e) => {
      this.mouseAction.mouseArgs = e;
      this.mouseAction.clickHandled = false;
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
          this.images[i] = img
          count++;
          if (count == keys.length) {
            resolve(game);
          }
        };
      }
    });
  }

  getTextureByName(name) {
    return this.images[name]
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
    }, 1000 / 30);
  }
}
