type Game = "斗牛" | "跑得快"
export interface member {
    name: string
    value: number
    exit: boolean
}
export interface memberRecord {
    name: string
    value: number
}
export interface record {
    winner: string
    sequence: number
    game: Game
    members: memberRecord[]
}

export class runRecord implements memberRecord {
    name!: string
    value!: number
    win: boolean = false
    detial(): string {
        return `测试`
    }
}
