export const nullValues  = ["", 0, null];
export function isNull(arg: any): boolean {
    return (nullValues.indexOf(arg) !== -1)? true : false;
}
export function iterate(callback: (argName: string, argValue: any) => void, args: object): void {
    try {
        if (args === undefined) throw `The iterate arguments cannot be ${typeof args}`;
        if (callback === undefined) throw `The iterate callback cannot be ${typeof callback}`;
        Object.entries(args).map(([argName, argValue]) => { if (typeof argValue === "object") { iterate(callback, argValue); } else { callback(argName, argValue); } })
    } catch(e) {
        console.error(e)
    }
}
export function overwrite(args: object, newArgs: object): object | undefined {
    try {
        if (args !== undefined && newArgs !== undefined) {
            iterate((argName: string, argValue: any) => {
                if (newArgs[argName as keyof typeof newArgs] !== undefined) {
                    args[argName as keyof typeof args] = newArgs[argName as keyof typeof newArgs];
                }
            }, newArgs);
        }
        return args;
    } catch(e) {
        console.error(e)
    }
}
export function setCounter(callback: (value: number) => void, intialValue: number, lastValue: number, interval: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
            callback(intialValue);
            intialValue++;
            if (intialValue >= lastValue) { 
                resolve("complete"); 
                clearInterval(intervalId);
            }
        }, interval);
    })
}
export function onViewport(el: HTMLElement): Promise<boolean> {
    if (el instanceof HTMLElement === false) throw `Cannot use ${ el }. ${ el } are not of type HTMLElement`;
    return new Promise((resolve, reject) => {
        if (inViewport(el)) resolve(true);
        window.addEventListener("scroll", () => { if (inViewport(el)) resolve(true); });
    })
}
export function inViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    if (
        rect.top >= 0
        && rect.left >= 0
        && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    ) {
        return true;
    }
    return false;
}
export function pascalCaseToKebabCase(pascalCase: string): string {
    return pascalCase.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}
export function script<T>(statements: any, instance?: any): T {
    return eval(`(function() { ${statements}; return this; })`).apply({...instance});
}