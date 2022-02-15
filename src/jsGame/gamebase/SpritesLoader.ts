import { get } from "../../utils/fetchHelper"
import { GameImage } from "./Source"

export interface Source {
    name: string
    url: string
    script: string | undefined
}

export function loadSprites(sources: any, script?: any, stepCallback?: (loaded: number, total: number) => void): Promise<Map<string, GameImage>> {
    let count = 0
    let images = new Map<string, GameImage>()
    return new Promise((resolve, reject) => {
        let keys = Object.keys(sources)
        if (keys.length === 0) {
            resolve(images)
        }
        for (const k of keys) {
            let img = new Image()
            let url = sources[k]
            img.src = url
            img.onload = async () => {
                let i = new GameImage(k, img)
                let s = tryGetProp(script, k)
                if (s !== undefined) {
                    let frames = await get(s)
                    i.frames = frames
                }
                images.set(k, i)
                count++
                if (stepCallback) stepCallback(count, keys.length)
                if (count == keys.length) {
                    resolve(images)
                }
            }
        }
    })
}

function tryGetProp(obj: any, key: string) {
    if (obj === undefined) return undefined
    if (obj[key] === undefined) return undefined
    return obj[key]
}
