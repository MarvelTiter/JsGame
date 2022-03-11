import { Vector2 } from "../data/Vector2"
import { RigidBase } from "./RigidBase"

export class RectRigid extends RigidBase {
    private _points: Vector2[]
    public get points(): Vector2[] {
        return this._points
    }
    w: number
    h: number
    constructor(w: number, h: number, density?: number) {
        super(density)
        this.w = w
        this.h = h
        let v1 = new Vector2(0, 0)
        let v2 = new Vector2(w, 0)
        let v3 = new Vector2(w, h)
        let v4 = new Vector2(0, h)
        this._points = [v1, v2, v3, v4]
    }
}
