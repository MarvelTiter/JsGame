import { Size } from "./data/Size"

export interface Source {
    name: string
    url: string
    size: Size
    texture: HTMLImageElement
}

export class GameImage implements Source {
    name: string
    url: string
    size: Size
    texture: HTMLImageElement
    constructor(name: string, url: string, texture: HTMLImageElement) {
        this.name = name
        this.url = url
        this.texture = texture
        this.size = new Size(texture.width, texture.height)
    }
}
