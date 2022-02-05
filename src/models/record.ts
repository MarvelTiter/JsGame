export interface member {
    name: string,
    value: number,
}
export interface memberRecord {
    name: string,
    value: number,
}
export interface record {
    winner: string,
    sequence: number,
    members: memberRecord[]
}
