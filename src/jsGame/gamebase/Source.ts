export interface Source {
  name: string;
  url: string;
  w: number;
  h: number;
  texture: HTMLImageElement
}

export class GameImage implements Source {
  name: string;
  url: string;
  w: number;
  h: number;
  texture: HTMLImageElement;
  constructor(name: string, url: string, texture: HTMLImageElement) {
    this.name = name
    this.url = url
    this.texture = texture
    this.w = texture.width
    this.h = texture.height
  }
}
