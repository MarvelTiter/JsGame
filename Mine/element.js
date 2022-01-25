class Element {
  constructor(game, sence, name) {
    this.game = game;
    this.sence = sence;
    this.texture = null;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.focus = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.hasChanged = true;
    this.canDraw = true;
    this.callBack = null;
    if (name) {
      this.texture = game.getTextureByName(name);
      this.w = this.texture.width;
      this.h = this.texture.height;
    }
  }

  static new(...args) {
    let i = new this(...args);
    return new Proxy(i, {
      set(tar, prop, value, reciver) {
        if (prop == "hasChanged") {
          return Reflect.set(tar, "hasChanged", false, reciver);
        }
        Reflect.set(tar, "hasChanged", true, reciver);
        return Reflect.set(tar, prop, value, reciver);
      },
    });
  }

  invokeCallback() {
    if (this.callBack) this.callBack(this);
  }

  registerAction(action) {
    this.callBack = action;
  }

  checkFocu(x, y) {
    let isfocus =
      x - this.offsetX > this.x &&
      x - this.offsetX < this.x + this.w &&
      y - this.offsetY > this.y &&
      y - this.offsetY < this.y + this.h;
    if (isfocus !== this.focus) {
      this.focus = isfocus;
    }
    return { success: isfocus, data: this };
  }

  updateRequest() {
    return this.hasChanged;
  }

  // 子类复写
  update() {}

  // 子类复写
  draw() {
    if (this.texture) {
      this.game.context.drawImage(
        this.texture,
        this.x + this.offsetX,
        this.y + this.offsetY,
        this.w,
        this.h,
      );
    }
  }

  // sence调用
  elementUpdate() {
    if (!this.updateRequest()) return;
    this.update();
    console.log('update');
    if (this.hasChanged) {
      this.elementDraw();
    }
    this.hasChanged = false;
  }

  // sence调用
  elementDraw() {
    if (!this.canDraw) return;
    this.draw();
  }
}
