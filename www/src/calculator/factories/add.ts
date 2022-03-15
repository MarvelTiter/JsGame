import { ICalculator, OperatorType } from "./define";

export class Add implements ICalculator {
    type: OperatorType = "Binary"
    calc(nums: number[]): number {
        return nums[0] + nums[1]
    }
}

export class Sub implements ICalculator {
    type: OperatorType = "Binary"
    calc(nums: number[]): number {
        return nums[0] - nums[1]
    }
}

export class Multiply implements ICalculator {
    type: OperatorType = "Binary"
    calc(nums: number[]): number {
        return nums[0] * nums[1]
    }
}

export class Division implements ICalculator {
    type: OperatorType = "Binary"
    calc(nums: number[]): number {
        return nums[0] / nums[1]
    }
}
