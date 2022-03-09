import { FrameDefinition, SpriteDefinition } from "./FrameDefinition"

export class GameImage {
    name: string
    // rect: IRect
    frames!: FrameDefinition[]
    sprites: any | undefined
    texture: HTMLImageElement
    constructor(name: string, texture: HTMLImageElement) {
        this.name = name
        this.texture = texture
    }
    getSprite(name?: string): SpriteDefinition {
        if (name === undefined) {
            return {
                name: this.name,
                x: 0,
                y: 0,
                w: this.texture.width,
                h: this.texture.height,
                scale: window.devicePixelRatio || 1
            }
        } else {
            if (this.sprites[name]) {
                return {
                    ...this.sprites[name],
                    scale: window.devicePixelRatio || 1
                }
            }
            throw new Error(`${name} did not exit`)
        }
    }
}
