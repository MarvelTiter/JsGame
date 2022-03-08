import { BaseSence } from "../../gamebase/BaseSence"
import { Game } from "../../gamebase/Game"
import { GameObject } from "../../gamebase/objects/GameObject"
import { Ground } from "./ground"
import { EnemyTank } from "./tank/enemy"
import { PlayerTank } from "./tank/player"
import { Wall } from "./wall"

export class MainSence extends BaseSence {
    constructor(game: Game) {
        super(game)
        this.maxX = 56 * 200
        this.minX = 0
        this.maxY = 56 * 50
        this.minY = 0
        this.camera.direction = "Both"
        this.setup()
    }
    canCollide(objectA: GameObject, objectB: GameObject): boolean {
        return objectA.group !== objectB.group || objectA.group === "All" || objectB.group === "All"
    }
    setup() {
        let ground = new Ground(this.game, this)
        this.addElement(ground)
        let player = new PlayerTank(this.game, this, 200, 200)
        let enemy = new EnemyTank(this.game, this, 400, 400)
        this.addElement(player)
        this.addElement(enemy)
        this.camera.bind(player)

        let left = new Wall(this.game, this, "LEFT")
        let top = new Wall(this.game, this, "TOP")
        let right = new Wall(this.game, this, "RIGHT")
        let bottom = new Wall(this.game, this, "BOTTOM")
        this.addElement(left)
        this.addElement(top)
        this.addElement(right)
        this.addElement(bottom)

        if (this.game.device === "MOBILE")
            this.configJoystick({
                Left: [
                    {
                        type: "Stick",
                        x: 100,
                        y: this.getWindowSize().h - 100,
                        events: {
                            onTop: () => {
                                player.move(1)
                            },
                            onDown: () => {
                                player.move(-1)
                            },
                            onLeft: () => {
                                player.turn(-1)
                            },
                            onRight: () => {
                                player.turn(1)
                            }
                        }
                    }
                ],
                Right: [
                    {
                        type: "Button",
                        x: this.getWindowSize().w - 100,
                        y: this.getWindowSize().h - 100,
                        events: {
                            onButtonA: () => {
                                player.fire()
                            }
                        }
                    }
                ]
            })

        this.registerKeyAction("a", () => {
            player.turn(-1)
        })
        this.registerKeyAction("d", () => {
            player.turn(1)
        })
        this.registerKeyAction("w", () => {
            player.move(1)
        })
        this.registerKeyAction("s", () => {
            player.move(-1)
        })
        this.registerKeyAction(
            " ",
            () => {
                player.fire()
            },
            1
        )
    }
}
