import { randomBetween } from "../../../utils/random"
import { BaseSence } from "../../gamebase/BaseSence"
import { Button } from "../../gamebase/Button"
import { Camera } from "../../gamebase/Camera"
import { Vector2 } from "../../gamebase/data/Vector2"
import { Game } from "../../gamebase/Game"
import { Background } from "./Background"
import { Ball } from "./Ball"
import { Tree } from "./Tree"

export class MainSence extends BaseSence {
    treeCollection!: Map<string, Tree>
    constructor(game: Game) {
        super(game)
        this.minX = 0
        this.maxX = this.size.w
        this.setup()
    }
    setup() {
        let bg = new Background(this.game, this)
        this.addElement(bg)

        let ball = new Ball(this.game, this)
        ball.pos.x = this.getWindowSize().w / 2
        ball.pos.y = this.getWindowSize().h / 2
        this.addElement(ball)

        this.treeCollection = new Map<string, Tree>()
        for (let index = 0; index < 20; index++) {
            let tree = new Tree(this.game, this, this.treeCollection)
            this.treeCollection.set(tree.id, tree)
            this.addElement(tree)
        }

        // this.camera = new Camera(this, this.game.context, this.game.area, "Vertical")
        this.camera.direction = "Vertical"
        this.camera.bind(ball)

        // let setting = Button.new(this.game, this, "setting")
        // setting.pos = new Vector2(550, 50)
        // this.addElement(setting)

        // let ret = Button.new(this.game, this, "return")
        // ret.pos = new Vector2(this.game.getWidth() / 2, this.game.getHeight() / 2)
        // this.addElement(ret)

        this.registerKeyAction("a", status => {
            ball.turnTo = true
            ball.direction = -1
        })

        this.registerKeyAction("d", status => {
            ball.turnTo = true
            ball.direction = 1
        })
    }

    createTree(num: number): Tree[] {
        let trees = []
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
        super.update()
        this.createTree(20 - this.treeCollection.size).forEach(tree => {
            this.treeCollection.set(tree.id, tree)
            this.addElement(tree)
        })
    }
}
