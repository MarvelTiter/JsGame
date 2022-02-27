import { Bound } from "./data/Bound"
import { FrameDefinition, SpriteDefinition } from "./FrameDefinition"

export class GameImage {
    name: string
    size: Bound
    frames!: FrameDefinition[]
    areas: any = undefined
    texture: HTMLImageElement
    constructor(name: string, texture: HTMLImageElement) {
        this.name = name
        this.texture = texture
        this.size = new Bound(texture.width, texture.height)
    }
    getRectByName(name: string): SpriteDefinition {
        if (this.areas === undefined) throw new Error("this image unsupported getRectByName")
        return this.areas[name] as SpriteDefinition
    }
}
