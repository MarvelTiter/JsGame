export function log(...args: any[]) {
    console.log.call(null, new Date().toLocaleTimeString(), ...args)
}
