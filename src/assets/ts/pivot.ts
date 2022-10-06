const nullValues  = ["", 0, null];

function isEmpty(arg: any): boolean {
    return (arg === undefined)? true : false;
}

function isNull(arg: any): boolean {
    return (nullValues.indexOf(arg) !== -1)? true : false;
}

// function preventTo(arg: any, type: string): boolean {
//     try {
//         if (!isEmpty(arg) && typeof arg === type) throw `The argument cannot be ${type}. Getting "${arg}" with type "${typeof arg}"`;
//         return true;
//     } catch(e) {
//         console.error(e);
//         return false;
//     }
// }

// function restrictTo(arg: any, type: string, notNull: boolean = false): boolean {
//     try {
//         if (!isEmpty(arg) && isNull(arg) && notNull === true) throw `The argument cannot be ${typeof arg}`;
//         if (!isEmpty(arg) && typeof arg !== type) throw `The argument type must be a ${type}. Getting "${arg}" with type "${typeof arg}"`;
//         return true;
//     } catch(e) {
//         console.error(e);
//         return false;
//     }
// }

function iterate(callback: (argName: string, argValue: any) => void, args: object): void {
    try {
        if (args === undefined) throw `The arguments cannot be ${typeof args}`;
        if (callback === undefined) throw `The callback cannot be ${typeof callback}`;
        Object.entries(args).map(([argName, argValue]) => {
            if (typeof argValue === "object") {
                iterate(callback, argValue);
            } else {
                callback(argName, argValue);
            }
        })
    } catch(e) {
        console.error(e)
    }
}

function merge(args: object, newArgs: object): object | undefined {
    try {
        if (
            args !== undefined
            && newArgs !== undefined
        ) {
            iterate((argName: string, argValue: any) => {
                if (
                    newArgs[argName as keyof typeof newArgs] !== undefined
                ) {
                    args[argName as keyof typeof args] = newArgs[argName as keyof typeof newArgs];
                }
            }, newArgs);
        }
        return args;
    } catch(e) {
        console.error(e)
    }
}

function setCounter(callback: (value: number) => void, intialValue: number, lastValue: number, interval: number): void {
    const intervalId = setInterval(() => { callback(intialValue); intialValue++; if (intialValue >= lastValue) clearInterval(intervalId); }, interval);
}

function inViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0
        && rect.left >= 0
        && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function pascalCaseToKebabCase(pascalCase: string) {
    return pascalCase.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}

type PivotData = object;
interface Pivot {
    new<T extends PivotData>(data?: T): { data: T };
    init(data: PivotData): void;
    dataWillBeDefined<T extends PivotData>(data: T | any): T;
    whenDefined(target: HTMLElement): void;
}
class Pivot implements Pivot {
    name: string = "Pivot";
    public constructor(data?: PivotData) { if (data !== undefined) this.init(data); }
    public init(data: PivotData): void {
        const childConstructor: any = this.constructor;
        const tagName: string = pascalCaseToKebabCase(this.name) + "-" + pascalCaseToKebabCase(childConstructor.name);
        customElements.define(tagName, class extends HTMLElement {
            public constructor() { super(); }
            public connectedCallback(): void {
                if (data === undefined) return;
                childConstructor.prototype.whenDefined.apply({ data: merge(childConstructor.prototype.dataWillBeDefined({...data}), this.dataset) }, [this]);
            }
        });
    }
    public dataWillBeDefined(data: PivotData): PivotData { return data; }
    public whenDefined(target: HTMLElement): void {}
}