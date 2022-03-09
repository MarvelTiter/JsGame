import { httpGet } from "../../utils/fetchHelper"
import { GameImage } from "./Source"

export interface Source {
    name: string
    url: string
    script: string | undefined
}

export async function loadSprites(sources: any, script?: any, progress?: (percent: number) => void): Promise<Map<string, GameImage>> {
    let count = 0
    let images = new Map<string, GameImage>()
    let keys = Object.keys(sources)
    if (keys.length === 0) {
        return images
    }
    let stepProgress = 1 / keys.length
    for (const k of keys) {
        let result = await httpGet(sources[k], sp => {
            if (progress) progress(count * stepProgress + sp * stepProgress)
        })
        let img = new Image()
        img.src = "data:image/png;base64, " + result.base64()
        let i = new GameImage(k, img)
        let s = tryGetProp(script, k)
        if (s !== undefined) {
            let file = await httpGet(s, sp => {
                if (progress) progress(count * stepProgress + sp * stepProgress)
            })
            let script = file.json()
            if (script instanceof Array) {
                i.frames = script
            } else {
                i.sprites = script
            }
        }
        images.set(k, i)
        count++
        if (progress) progress(count * stepProgress)
    }
    return images
}

function tryGetProp(obj: any, key: string) {
    if (obj === undefined) return undefined
    if (obj[key] === undefined) return undefined
    return obj[key]
}
