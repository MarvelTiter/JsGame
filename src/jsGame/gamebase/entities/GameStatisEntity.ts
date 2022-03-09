// import { BaseSence } from "../BaseSence"
// import { Bound } from "../data/Bound"
// import { createBoxRect } from "../data/Rect"
// import { Vector2 } from "../data/Vector2"
// import { Game } from "../Game"
// import { CustomObject } from "../objects/CustomObject"
// import { GameImage } from "../Source"

// export class GameStatisEntity extends CustomObject {
//     image: GameImage
//     constructor(game: Game, sence: BaseSence, name: string) {
//         super(game, sence)
//         this.image = game.getTextureByName(name)
//         this.rect = createBoxRect(this.image.texture.width, this.image.texture.height)
//     }

//     private _center: Vector2 | undefined
//     public get center(): Vector2 {
//         if (this._center === undefined) {
//             this._center = new Vector2(this.pos.x + this.rect.w / 2, this.pos.y + this.rect.h / 2)
//         }
//         return this._center
//     }

//     draw(context: CanvasContext): void {
//         ctx.drawImage(this.image.texture, this.pos.x + this.offset.x, this.pos.y + this.offset.y, this.rect.w, this.rect.h)
//     }
// }
