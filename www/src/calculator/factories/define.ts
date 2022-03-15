export type OperatorType = "Unary" | "Binary"
export interface ICalculator {
    type:OperatorType
    calc(nums:number[]):number
}
