import { BaseSence } from "../../gamebase/BaseSence"
import { Button } from "../../gamebase/Button"
import { Bound } from "../../gamebase/data/Bound"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { Contact } from "../../gamebase/collision/Contact"
import { Background } from "./Background"
import { Ball } from "./Ball"
import { Tree } from "./Tree"
import { Joystick } from "../../gamebase/virtualJoystick/Joystick"

export class MainSence extends BaseSence {
    treeCollection!: Map<string, Tree>
    constructor(game: Game) {
        super(game)
        this.minX = 0
        this.setup()
    }
    ball!: Ball
    setup() {
        let bg = new Background(this.game, this)
        this.addElement(bg)

        let ball = new Ball(this.game, this)
        ball.pos.x = this.getWindowSize().w / 2
        ball.pos.y = this.getWindowSize().h / 2
        ball.addCircleRigid(ball.radius)
        this.addElement(ball)
        this.ball = ball

        this.treeCollection = new Map<string, Tree>()
        for (let index = 0; index < 20; index++) {
            let tree = new Tree(this.game, this, this.treeCollection)
            this.treeCollection.set(tree.id, tree)
            this.addElement(tree)
        }

        // this.camera = new Camera(this, this.game.context, this.game.area, "Vertical")
        this.camera.direction = "Vertical"
        this.camera.bind(ball)

        if (this.game.device === "MOBILE") {
            this.configJoystick({
                Left: [
                    {
                        type: "Stick",
                        x: 100,
                        y: this.getWindowSize().h - 100,
                        events: {
                            onTouchDown: () => {
                                ball.turnTo = true
                            },
                            onTouchUp: () => {
                                ball.turnTo = false
                            },
                            onLeft: () => {
                                ball.direction = -1
                            },
                            onRight: () => {
                                ball.direction = 1
                            }
                        }
                    }
                ]
            })
        }
        this.registerKeyAction(
            "a",
            () => {
                ball.turnTo = true
                ball.direction = -1
            },
            () => {
                ball.turnTo = false
            },
            1
        )

        this.registerKeyAction(
            "d",
            () => {
                ball.turnTo = true
                ball.direction = 1
            },
            () => {
                ball.turnTo = false
            },
            1
        )
    }

    createTree(num: number): Tree[] {
        let trees: Tree[] = []
        if (num === 0) return trees
        while (num > 0) {
            let tree = new Tree(this.game, this, this.treeCollection)
            trees.push(tree)
            num--
        }
        return trees.sort((a, b) => {
            const xConfig = a.pos.y
            const yConfig = b.pos.y
            return xConfig - yConfig
        })
    }

    public update(): void {
        this.createTree(20 - this.treeCollection.size).forEach(tree => {
            this.treeCollection.set(tree.id, tree)
            this.addElement(tree)
        })
    }
}
