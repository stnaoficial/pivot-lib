const nullValues  = ["", 0, null];

function isEmpty(arg: any): boolean {
    return (arg === undefined)? true : false;
}

function isNull(arg: any): boolean {
    return (nullValues.indexOf(arg) !== -1)? true : false;
}

function preventTo(arg: any, type: string): boolean {
    try {
        if (!isEmpty(arg) && typeof arg === type) throw `The argument cannot be ${type}. Getting "${arg}" with type "${typeof arg}"`;
        return true;
    } catch(e) {
        console.error(e);
        return false;
    }
}

function restrictTo(arg: any, type: string, notNull: boolean = false): boolean {
    try {
        if (!isEmpty(arg) && isNull(arg) && notNull === true) throw `The argument cannot be ${typeof arg}`;
        if (!isEmpty(arg) && typeof arg !== type) throw `The argument type must be a ${type}. Getting "${arg}" with type "${typeof arg}"`;
        return true;
    } catch(e) {
        console.error(e);
        return false;
    }
}

function iterate(callback: (argName: string, argValue: any) => void, args: object): void {
    try {
        if (isEmpty(args)) throw `The arguments cannot be ${typeof args}`;
        if (isEmpty(callback)) throw `The callback cannot be ${typeof callback}`;
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
            !isEmpty(args)
            && !isEmpty(newArgs)
        ) {
            iterate((argName: string, argValue: any) => {
                if (
                    !isEmpty(newArgs[argName as keyof typeof newArgs])
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
    let newValue = intialValue;
    let intervalId = setInterval(() => { callback(newValue); newValue++; if (newValue >= lastValue) clearInterval(intervalId); }, interval);
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




type PivotTemplateArgument = string | null;

type PivotDataArgument = any | null;

type PivotHandlerArgument = object | null;

type PivotArgument = PivotTemplateArgument | PivotDataArgument | PivotHandlerArgument | null;

interface PivotArguments {
    template?: PivotTemplateArgument;
    dataset?: PivotDataArgument;
    handler?: PivotHandlerArgument;
}







interface PivotSession {
    UseCustomElementTemplateName(templateName: string): Array<HTMLElement>;
}
class PivotSession implements PivotSession {
    name: string = "PivotSession";

    public static UseCustomElementTemplateName(templateName: string): Array<HTMLElement> {
        let occurs: Array<HTMLElement> = [];

        customElements.define(templateName, class extends HTMLElement {
            constructor() { super(); }
            connectedCallback() { occurs.push(this); }
        });
    
        return occurs;
    }
}







interface Pivot {
    args?: PivotArguments;
    new<T extends PivotArguments>(args: T): { args: T };
    whenDefined(occur: HTMLElement): void;
}
class Pivot implements Pivot {
    name: string = "Pivot";

    args?: PivotArguments = {};

    constructor(args?: PivotArguments) {
        if (args === undefined) return;

        let templateName = `template-${args.template}`;

        let occurs = PivotSession.UseCustomElementTemplateName(templateName);

        customElements.whenDefined(templateName).then(() => {
            this.args = {...args};

            occurs.map(occur => {
                if (this.args === undefined) return;
                this.args.dataset = {...args.dataset};
                this.args.dataset = merge(this.args.dataset, occur.dataset);
                this.whenDefined(occur);
            })
        })
    }
    whenDefined(occur: HTMLElement): void {}
}