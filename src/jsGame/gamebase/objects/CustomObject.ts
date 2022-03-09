import { BaseSence } from "../BaseSence"
import { Vector2 } from "../data/Vector2"
import { Game } from "../Game"
import { CircleRigid } from "../rigid/CircleRigid"
import { RectRigid } from "../rigid/RectRigid"
import { RigidBase } from "../rigid/RigidBase"
import { TriangleRigid } from "../rigid/TriangleRigid"
import { GameObject } from "./GameObject"

export class CustomObject extends GameObject {
    public get center(): Vector2 {
        throw new Error("Method not implemented.")
    }
    constructor(game: Game, sence: BaseSence) {
        super(game, sence)
    }
    afterCollide() {}
    public addRectRigid(w: number, h: number, options?: Partial<RigidBase>): void {
        let rg = new RectRigid(w, h)
        rg.bind(this)
        Object.assign(rg, options)
        rg.init()
        this.addComponent(rg)
    }
    public addCircleRigid(radius: number, options?: Partial<RigidBase>): void {
        let cg = new CircleRigid(radius)
        cg.bind(this)
        Object.assign(cg, options)
        cg.init()
        this.addComponent(cg)
    }
    public addTriangleRigid(len: number, theta: number, options?: Partial<RigidBase>): void {
        let tg = new TriangleRigid(len, theta)
        tg.bind(this)
        Object.assign(tg, options)
        tg.init()
        this.addComponent(tg)
    }
}
