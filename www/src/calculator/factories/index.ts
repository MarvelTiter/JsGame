import { Add, Division, Mod, Multiply, Sub } from "./add"
import { ICalculator } from "./define"

function init():Map<string,ICalculator>{
    let map = new Map<string,ICalculator>()
    map.set("+",new Add())
    map.set("-",new Sub())
    map.set("*",new Multiply())
    map.set("/",new Division())
    map.set("%",new Mod())
    return map
}

export class CalcFactory {
    public static Operators: Map<string, ICalculator> = init()
}
