import { IRectangle, Rect } from "./Rect"

const MAX_OBJECTS: number = 1
const MAX_LEVELS: number = 3
export class QuadTree<T extends IRectangle> {
    private objects!: T[]
    private level: number = 0
    private bounds!: Rect
    private nodes!: QuadTree<T>[] | null[]

    constructor(level: number, pBounds: Rect) {
        this.level = level
        this.bounds = pBounds
        this.objects = new Array<T>()
        this.nodes = new Array(4)
    }
    clear(): void {
        this.objects.splice(0)
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i]?.clear()
            this.nodes[i] = null
        }
    }
    split(): void {
        let subW = this.bounds.w / 2
        let subH = this.bounds.h / 2
        let { x, y } = this.bounds

        this.nodes[0] = new QuadTree<T>(this.level + 1, { x: x + subW, y, w: subW, h: subH })
        this.nodes[1] = new QuadTree<T>(this.level + 1, { x, y, w: subW, h: subH })
        this.nodes[2] = new QuadTree<T>(this.level + 1, { x, y: y + subH, w: subW, h: subH })
        this.nodes[3] = new QuadTree<T>(this.level + 1, { x: x + subW, y: y + subH, w: subW, h: subH })
    }
    getIndexes(pRect: Rect): number[] {
        let indexes: number[] = []
        let centerX = this.bounds.x + this.bounds.w / 2
        let centerY = this.bounds.y + this.bounds.h / 2
        let topQuad: boolean = pRect.y >= centerY
        let bottomQuad: boolean = pRect.y - pRect.h <= centerY
        let topAndBottomQuad: boolean = pRect.y + pRect.h + 1 >= centerY
        if (topAndBottomQuad) {
            topQuad = false
            bottomQuad = false
        }
        // Check if object is in left and right quad
        if (pRect.x + pRect.w + 1 >= centerX && pRect.x - 1 <= centerX) {
            if (topQuad) {
                indexes.push(2)
                indexes.push(3)
            } else if (bottomQuad) {
                indexes.push(0)
                indexes.push(1)
            } else if (topAndBottomQuad) {
                indexes.push(0)
                indexes.push(1)
                indexes.push(2)
                indexes.push(3)
            }
        }

        // Check if object is in just right quad
        else if (pRect.x + 1 >= centerX) {
            if (topQuad) {
                indexes.push(3)
            } else if (bottomQuad) {
                indexes.push(0)
            } else if (topAndBottomQuad) {
                indexes.push(3)
                indexes.push(0)
            }
        }
        // Check if object is in just left quad
        else if (pRect.x - pRect.w <= centerX) {
            if (topQuad) {
                indexes.push(2)
            } else if (bottomQuad) {
                indexes.push(1)
            } else if (topAndBottomQuad) {
                indexes.push(2)
                indexes.push(1)
            }
        } else {
            indexes.push(-1)
        }

        return indexes
    }
    insert(obj: T): void {
        let first: T = obj
        let pRect: Rect = first.getRect()

        if (this.nodes[0] != null) {
            let indexes: number[] = this.getIndexes(pRect)
            for (let ii = 0; ii < indexes.length; ii++) {
                let index = indexes[ii]
                if (index != -1) {
                    this.nodes[index]?.insert(first)
                    return
                }
            }
        }

        this.objects.push(first)

        if (this.objects.length > MAX_OBJECTS && this.level < MAX_LEVELS) {
            if (this.nodes[0] == null) {
                this.split()
            }

            let i = 0
            while (i < this.objects.length) {
                let sqaureOne: T = this.objects[i]
                let oRect: Rect = sqaureOne.getRect()
                let indexes = this.getIndexes(oRect)
                for (let ii = 0; ii < indexes.length; ii++) {
                    let index = indexes[ii]
                    if (index != -1) {
                        this.nodes[index]?.insert(sqaureOne)
                        let i = this.objects.indexOf(sqaureOne)
                        this.objects.splice(i, 1)
                    } else {
                        i++
                    }
                }
            }
        }
    }
    retrieve(fSpriteList: T[], pRect: Rect): T[] {
        let indexes = this.getIndexes(pRect)
        for (let ii = 0; ii < indexes.length; ii++) {
            let index = indexes[ii]
            if (index != -1 && this.nodes[0] != null) {
                this.nodes[index]?.retrieve(fSpriteList, pRect)
            }
            fSpriteList = fSpriteList.concat(this.objects)
        }

        return fSpriteList
    }
}
