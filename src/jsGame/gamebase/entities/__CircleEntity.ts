// import { BaseSence } from "../BaseSence"
// import { Bound } from "../data/Bound"
// import { Vector2 } from "../data/Vector2"
// import { Game } from "../Game"
// import { GameObject } from "../objects/GameObject"
// import { MouseArgs } from "../MouseArgs"
// import { CircleRigid } from "../rigid/CircleRigid"
// import { CustomObject } from "../objects/CustomObject"
// import { GameEntity } from "./GameEntity"

// export class CircleEntity extends GameEntity {
//     radius!: number
//     constructor(game: Game, sence: BaseSence, name: string) {
//         super(game, sence, name)
//     }
//     checkFocu(x: number, y: number): boolean {
//         let clickPoint = new Vector2(x, y)
//         let distance = this.pos.copy().sub(clickPoint).length()
//         let isfocus = distance <= this.radius
//         if (isfocus !== this.focus) {
//             this.focus = isfocus
//         }
//         return this.focus
//     }
//     enableDrag: boolean = false
//     onClick(e: MouseArgs): void {
//         this.enableDrag = true
//     }
//     onMouseOver(e: MouseArgs): void {
//         if (this.enableDrag) {
//             let { x, y } = e
//             let clickPoint = new Vector2(x, y)
//             let offset = clickPoint.sub(this.pos)
//             this.pos.add(offset)
//         }
//     }
//     onMouseUp(): void {
//         this.enableDrag = false
//     }
// }
