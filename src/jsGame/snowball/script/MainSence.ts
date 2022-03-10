import { BaseSence } from "../../gamebase/BaseSence"
import { Game } from "../../gamebase/Game"
import { Background } from "./Background"
import { Ball } from "./Ball"
import { Tree } from "./Tree"

export class MainSence extends BaseSence {
    treeCollection!: Map<string, Tree>
    constructor(game: Game) {
        super(game)
        this.minX = 0
        this.maxY = Number.MAX_VALUE
        this.setup()
    }
    ball!: Ball
    setup() {
        let bg = new Background(this.game, this)
        this.addElement(bg)

        let ball = new Ball(this.game, this)
        this.addElement(ball)
        this.ball = ball

        this.treeCollection = new Map<string, Tree>()
        for (let index = 0; index < 20; index++) {
            let tree = new Tree(this.game, this, this.treeCollection)
            this.treeCollection.set(tree.id, tree)
            this.addElement(tree)
        }

        this.camera.direction = "Vertical"
        this.camera.bind(ball)

        if (this.game.device === "MOBILE") {
            this.configJoystick([
                {
                    type: "Stick",
                    x: (100).actualPixel(),
                    y: this.getWindowSize().h - (100).actualPixel(),
                    events: {
                        onLeft: () => {
                            ball.turn(-1)
                        },
                        onRight: () => {
                            ball.turn(1)
                        },
                        onDown: () => {
                            ball.degree = 0
                        }
                    }
                }
            ])
        }
        this.registerKeyAction("a", () => {
            ball.turn(-1)
        })

        this.registerKeyAction("d", () => {
            ball.turn(1)
        })

        this.registerKeyAction("s", () => {
            ball.degree = 0
        })
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
