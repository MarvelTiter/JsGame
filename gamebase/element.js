function observe(data) {
  if (!data || typeof data !== "object") {
    return;
  }
  // 取出所有属性遍历
  Object.keys(data).forEach((key) => {
    if (key == "hasChanged") return;
    defineProp(data, key, data[key]);
  });
}
function defineProp(data, key, childVal) {
  // observe(childVal); //监听子属性
  Object.defineProperty(data, key, {
    set: (newVal) => {
      data.hasChanged = true;
      childVal = newVal;
    },
    get: () => {
      return childVal;
    },
    enumerable: true, // 可枚举
    configurable: false, // 不能再define
  });
}

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
    this.onTick = null;

    if (name) {
      this.texture = game.getTextureByName(name);
      this.w = this.texture.width;
      this.h = this.texture.height;
    }
  }

  static new(...args) {
    let i = new this(...args);
    observe(i);
    return i;
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
    return this.focus;
  }

  updateRequest() {
    return this.hasChanged;
  }

  onClick(e) {}
  onMouseOver(e) {}
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

    this.hasChanged = false;
  }

  // sence调用
  elementDraw() {
    if (!this.canDraw) return;
    this.draw();
  }
}
