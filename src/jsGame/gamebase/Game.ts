import { BaseSence } from "./BaseSence";
import { GameImage, Source } from "./Source";

export const RESET = 0x0000;
export const MOUSE_MOVE = 0x0001;
export const MOUSE_LB_CLICK = 0x0010;
export const MOUSE_RB_CLICK = 0x0100;
export const MOUSE_MOVING = "MOVE";
export const MOUSE_PRESS = "PRESS";
export const MOUSE_RELEASE = "RELEASE";
export const DEVICE_MOBILE = "MOBILE"
export const DEVICE_PC = "PC"
export interface Area {
  width: number;
  height: number;
}
export class Game {
  canvas: any;
  context: any;
  enableMouseAction: boolean;
  images: Map<string, GameImage>;
  sence!: BaseSence;
  area!: Area;
  device: string = DEVICE_PC
  constructor(area?: Area) {
    this.canvas = document.querySelector("#canvas");
    this.context = this.canvas.getContext("2d");
    this.enableMouseAction = false;
    this.images = new Map<string, GameImage>();
    this.areaSetup(area)

    this.eventSetup();
  }
  areaSetup(area?: Area) {
    let isMobile = /Android|webOS|iPhone|iPod/i.test(navigator.userAgent)
    if (isMobile) {
      this.device = DEVICE_MOBILE
      window.document.documentElement.requestFullscreen()
    }
    let w: number = 0
    let h: number = 0
    if (!area) {
      if (isMobile) {
        w = window.screen.availWidth
        h = window.screen.availHeight
      }
      else {
        w = 1000
        h = 700
      }
    }
    this.area = area ?? {
      width: w,
      height: h,
    };
    this.canvas.width = this.area.width
    this.canvas.height = this.area.height
  }
  eventSetup() {
    this.canvas.addEventListener("mouseover", (e: MouseEvent) => {
      e.preventDefault();
      this.enableMouseAction = true;
    });
    this.canvas.addEventListener("mouseout", (e: MouseEvent) => {
      e.preventDefault();
      this.enableMouseAction = false;
    });
    this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
      e.preventDefault();
      if (this.enableMouseAction && this.sence) {
        this.sence.handleMousevove(e);
      }
    });
    this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
      console.log('click');
      
      e.preventDefault();
      if (this.sence) {
        this.sence.handleMousedown(e);
      }
    });
    this.canvas.addEventListener("mouseup", (e: MouseEvent) => {
      e.preventDefault();
      if (this.sence) {
        this.sence.handleMouseup(e);
      }
    });
    this.canvas.addEventListener("touchstart", (e: any) => {
      e.preventDefault()
      if (this.sence)
        this.sence.handleTouchStart(e)
    })
    this.canvas.addEventListener("touchend", (e: any) => {
      e.preventDefault()
      if (this.sence)
        this.sence.handleTouchEnd(e)
    })
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (this.sence) {
        this.sence.handleKeydown(e);
      }
    });
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      if (this.sence) {
        this.sence.handleKeyup(e);
      }
    });
    window.addEventListener("contextmenu", (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
    });
  }

  loadSources(sources: any): Promise<Game> {
    let game = this;
    let count = 0;
    return new Promise((resolve, reject) => {
      let keys = Object.keys(sources);
      for (const k of keys) {
        let img = new Image();
        let url = sources[k];
        img.src = url;
        img.onload = () => {
          let i = new GameImage(k, url, img)
          this.images.set(k, i);
          count++;

          if (count == keys.length) {
            resolve(game);
          }
        };
      }
    });
  }

  public getTextureByName(name: string): GameImage {
    let i = this.images.get(name);
    if (i === undefined) throw new Error(`image named ${name} is not found`);
    return i;
  }

  public setSence(sence: BaseSence): void {
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
