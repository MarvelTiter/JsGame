/**
 * 动画帧定义
 */
export interface SpriteDefinition {
    name: string
    x: number
    y: number
    w: number
    h: number
}
export interface FrameDefinition {
    filename: string
    frame: {
        x: number
        y: number
        w: number
        h: number
    }
    rotated: false
    spriteSourceSize: {
        x: number
        y: number
        w: number
        h: number
    }
    texture?: HTMLImageElement
}
