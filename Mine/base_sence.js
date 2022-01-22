class BaseSence {
  constructor(game) {
    this.game = game
    this.elements = [];
  }

  addElement(e) {
    this.elements.push(e);
  }

  update() {
    for (const e of this.elements) {
      e.update();
    }
  }

  draw() {
    for (const e of this.elements) {
      e.draw();
    }
  }
}
