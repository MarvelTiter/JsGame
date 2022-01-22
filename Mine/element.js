class Element {
  constructor(game, name) {
    this.game = game;
    this.texture = null;
    if (name) {
      this.texture = game.getTextureByName(name);
      this.x = 0;
      this.y = 0;
      this.w = this.texture.width;
      this.h = this.texture.height;
    }
  }
  update() {}

  draw() {
    if (this.texture)
      this.game.context.drawImage(this.texture, this.x, this.y, this.w, this.h);
  }
}
