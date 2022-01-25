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
      e.elementUpdate();
    }
  }

  draw() {
    for (const e of this.elements) {
      e.elementDraw();
    }
  }
}
