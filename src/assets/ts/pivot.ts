const nullValues  = ["", 0, null];

function isNull(arg: any): boolean {
    return (nullValues.indexOf(arg) !== -1)? true : false;
}

function iterate(callback: (argName: string, argValue: any) => void, args: object): void {
    try {
        if (args === undefined) throw `The iterate arguments cannot be ${typeof args}`;
        if (callback === undefined) throw `The iterate callback cannot be ${typeof callback}`;
        Object.entries(args).map(([argName, argValue]) => { if (typeof argValue === "object") { iterate(callback, argValue); } else { callback(argName, argValue); } })
    } catch(e) {
        console.error(e)
    }
}

function overwrite(args: object, newArgs: object): object | undefined {
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

function setCounter(callback: (value: number) => void, intialValue: number, lastValue: number, interval: number): Promise<string> {
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

function inViewport(el: HTMLElement): Promise<boolean> {
    if (el instanceof HTMLElement === false) throw `Cannot use ${ el }. ${ el } are not of type HTMLElement`;
    return new Promise((resolve, reject) => {
        check();
        window.addEventListener("scroll", () => { check(); });
        function check() {
            const rect = el.getBoundingClientRect();
            if (
                rect.top >= 0
                && rect.left >= 0
                && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
                && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            ) {
                resolve(true);
            }
        }
    })
}

function pascalCaseToKebabCase(pascalCase: string) {
    return pascalCase.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}

namespace PivotCore {
    type PivotData = object;
    export interface Pivot {
        new<T extends PivotData>(data?: T): { data: T };
        init(data: PivotData): void;
        dataWillBeDefined<T extends PivotData>(data: T | any): T;
        whenDefined(target: HTMLElement): void;
    }
    export class Pivot implements Pivot {
        name: string = "Pivot";
        public constructor(data?: PivotData) { if (data !== undefined) this.init(data); }
        public init(data: PivotData): void {
            const pivot: Pivot = this.constructor.prototype;
    
            const tagNamePrefix = pascalCaseToKebabCase(this.name);
            const tagNameSufix = pascalCaseToKebabCase(pivot.constructor.name);
            const tagName: string = `${tagNamePrefix}-${tagNameSufix}`;
    
            customElements.define(tagName, class extends HTMLElement {
                public constructor() { super(); }
                public connectedCallback(): void {
                    if (data === undefined) return;
                    customElements.whenDefined(tagName).then(() => {
                        // Overwrites data property to whenDefined method
                        pivot.whenDefined.apply({ data: overwrite(pivot.dataWillBeDefined({...data}), this.dataset) }, [this]);
                    });
                }
            });
        }
        public dataWillBeDefined(data: PivotData): PivotData { return data; }
        public whenDefined(target: HTMLElement): void {}
    }
}