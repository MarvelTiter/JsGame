import { BaseSence } from "./BaseSence"
import { Size } from "./data/Size"
import { createOption, defaultOption, options } from "./GameOptions"
import { GameObject } from "./objects/GameObject"
import { GameImage } from "./Source"

export const RESET = 0x0000
export const MOUSE_MOVE = 0x0001
export const MOUSE_LB_CLICK = 0x0010
export const MOUSE_RB_CLICK = 0x0100
export const MOUSE_MOVING = "MOVE"
export const MOUSE_PRESS = "PRESS"
export const MOUSE_RELEASE = "RELEASE"
export const DEVICE_MOBILE = "MOBILE"
export const DEVICE_PC = "PC"

/**
 * Window Attach
 */
declare global {
    interface Window {
        Pause: boolean
        Debug: boolean
        Update: Function[]
    }
}
window.Update = []
export class Game {
    canvas: HTMLCanvasElement
    context: any
    enableMouseAction: boolean
    images: Map<string, GameImage>
    sence!: BaseSence
    area!: Size
    device: string = DEVICE_PC
    options: options
    constructor(images: Map<string, GameImage>, opts?: Partial<options>, area?: Size) {
        this.canvas = document.querySelector("#canvas") as HTMLCanvasElement
        this.context = this.canvas.getContext("2d")
        this.enableMouseAction = false
        this.images = images
        this.areaSetup(area)
        this.options = createOption(opts || {})
        this.eventSetup()
    }
    areaSetup(area?: Size) {
        let isMobile = /Android|webOS|iPhone|iPod/i.test(navigator.userAgent)
        if (isMobile) {
            this.device = DEVICE_MOBILE
            // window.document.documentElement.requestFullscreen()
        }
        let w: number = 0
        let h: number = 0
        if (!area) {
            w = window.document.body.clientWidth
            h = window.document.body.clientHeight
        }
        this.area = area ?? new Size(w, h)
        this.canvas.width = this.area.w
        this.canvas.height = this.area.h
    }
    eventSetup() {
        this.canvas.addEventListener("mouseover", (e: MouseEvent) => {
            e.preventDefault()
            let handleMouseMove = (event: MouseEvent) => {
                event.preventDefault()
                this.sence.handleMousemove(event)
            }
            let handleMouseDown = (event: MouseEvent) => {
                this.sence.handleMousedown(event)
            }
            let handleMouseUp = (event: MouseEvent) => {
                this.sence.handleMouseup(event)
            }
            let handleMoveout = (event: MouseEvent) => {
                this.canvas.removeEventListener("mousemove", handleMouseMove)
                this.canvas.removeEventListener("mouseout", handleMoveout)
                this.canvas.removeEventListener("mousedown", handleMouseDown)
                this.canvas.removeEventListener("mouseup", handleMouseUp)
            }
            this.canvas.addEventListener("mousemove", handleMouseMove)
            this.canvas.addEventListener("mousedown", handleMouseDown)
            this.canvas.addEventListener("mouseup", handleMouseUp)
            this.canvas.addEventListener("mouseout", handleMoveout)
        })

        this.canvas.addEventListener("touchstart", (e: TouchEvent) => {
            // e.preventDefault()
            if (this.sence) this.sence.handleTouchStart(e)
        })
        this.canvas.addEventListener("touchmove", (e: TouchEvent) => {
            if (this.sence) this.sence.handleTouchMove(e)
        })
        this.canvas.addEventListener("touchend", (e: TouchEvent) => {
            e.preventDefault()
            if (this.sence) this.sence.handleTouchEnd(e)
        })
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (this.sence) {
                this.sence.handleKeydown(e)
            }
        })
        window.addEventListener("keyup", (e: KeyboardEvent) => {
            if (this.sence) {
                this.sence.handleKeyup(e)
            }
        })
        window.addEventListener("contextmenu", (e: MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
        })
    }

    public getTextureByName(name: string): GameImage {
        let i = this.images.get(name)
        if (i === undefined) throw new Error(`image named ${name} is not found`)
        return i
    }

    public reSize(w: number, h: number): void {
        this.areaSetup(new Size(w, h))
    }

    public setSence(sence: BaseSence): void {
        this.sence = sence
    }

    private loop() {
        if (window.Pause) {
            window.requestAnimationFrame(this.loop.bind(this))
            return
        }
        this.sence.Tick()
        window.requestAnimationFrame(this.loop.bind(this))
    }

    run() {
        if (!this.sence) return
        this.loop()
    }
}
