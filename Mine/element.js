class Element {
  constructor(game, name) {
    this.game = game;
    this.texture = null;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.hasChanged = true;
    this.canDraw = true;
    if (name) {
      this.texture = game.getTextureByName(name);
      this.w = this.texture.width;
      this.h = this.texture.height;
    }
  }

  static new(...args) {
    let i = new this(...args);
    return new Proxy(i, {
      // apply(tar, prop) {
      //   console.log(tar, prop);
      // },
      // getPrototypeOf(tar, prop) {
      //   console.log(tar, prop);
      // },
      set(tar, prop, value, reciver) {
        // console.log(tar,prop);
        if (prop == "hasChanged" || prop == "canDraw") {
          return (
            Reflect.set(tar, "hasChanged", false, reciver) &&
            Reflect.set(tar, "canDraw", false, reciver)
          );
        }
        Reflect.set(tar, "hasChanged", true, reciver);
        Reflect.set(tar, "canDraw", true, reciver);
        return Reflect.set(tar, prop, value, reciver);
      },
    });
  }

  update() {
    this.elementUpdate();
    this.hasChanged = false;
  }
  elementUpdate() {}

  draw() {
    // if (!this.canDraw) return
    if (this.texture) {
      // && this.canDraw
      this.game.context.drawImage(
        this.texture,
        this.x + this.offsetX,
        this.y + this.offsetY,
        this.w,
        this.h,
      );
      // this.canDraw = false;
    }
  }
}
