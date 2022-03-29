import { httpGet } from "../../utils/fetchHelper"
import { ISize } from "./ISize"
export type PictureType = "Attack" | "Skill" | "Power" | "Relic" | "Status"
export function clear(canvas1: HTMLCanvasElement | undefined, canvas2: HTMLCanvasElement | undefined) {
    if (canvas1) {
        canvas1.getContext("2d")?.clearRect(0, 0, canvas1.width, canvas1.height)
    }
    if (canvas2) {
        canvas2.getContext("2d")?.clearRect(0, 0, canvas2.width, canvas2.height)
    }
}
export async function drawBackground(img: HTMLImageElement, size1: ISize, type?: PictureType) {
    // draw background img
    // let display = canvas.getContext("2d")!
    let ctx1 = createContext(size1)
    ctx1.drawImage(img, 0, 0, size1.w, size1.h)
    // draw cover
    if (type !== undefined) await cover(ctx1, type)
    // display.drawImage(ctx1.canvas, 0, 0, size1.w, size1.h)
    return ctx1.canvas
}

export function drawForeground(img: HTMLImageElement, size1: ISize, scale: number = 1, offsetX: number = 0, offsetY: number = 0) {
    // let bg = canvas.getContext("2d")!
    let ctx1 = createContext(size1)
    let centreX = size1.w / 2 + offsetX
    let centreY = size1.h / 2 + offsetY
    let w = img.width * scale
    let h = img.height * scale
    ctx1.translate(centreX, centreY)
    ctx1.drawImage(img, -w / 2, -h / 2, w, h)
    ctx1.translate(-centreX, -centreY)
    // bg.drawImage(ctx1.canvas, 0, 0, size1.w, size1.h)
    return ctx1.canvas
}

export function drawOutline(canvas: HTMLCanvasElement) {
    let ctx = canvas.getContext("2d")!
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let data = imgData.data
    for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3]
        if (a !== 0) {
            data[i] = 255
            data[i + 1] = 255
            data[i + 2] = 255
            data[i + 3] = 255
        }
    }
    ctx.putImageData(imgData, 0, 0)
}

export function sync(canvas1: HTMLCanvasElement, canvas2: HTMLCanvasElement, size2: ISize) {
    // sync canvas
    let ctx2 = canvas2.getContext("2d")!
    ctx2.clearRect(0, 0, size2.w, size2.h)
    ctx2.drawImage(canvas1, 0, 0, size2.w, size2.h)
}

const cover = async (ctx: CanvasRenderingContext2D, type: PictureType) => {
    let imgData = ctx.getImageData(0, 0, 500, 380)
    let data = imgData?.data
    let result = await httpGet(`/data/${type.toLocaleLowerCase()}_cover.json`)
    let nums = result.json() as Number[]
    let set = new Set(nums)
    for (let i = 0; i < data.length; i += 4) {
        if (set.has(i)) {
            data[i] = 0
            data[i + 1] = 0
            data[i + 2] = 0
            data[i + 3] = 0
        }
    }
    ctx.putImageData(imgData, 0, 0)
}

const createContext = (size: ISize) => {
    let canvas = document.createElement("canvas")
    canvas.width = size.w
    canvas.height = size.h
    return canvas.getContext("2d")!
}
