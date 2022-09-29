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

function iterate(args: object, callback: (argName: string, argValue: any) => void): void {
    try {
        if (isEmpty(args)) throw `The arguments cannot be ${typeof args}`;
        if (isEmpty(callback)) throw `The callback cannot be ${typeof callback}`;
        Object.entries(args).map(([argName, argValue]) => {
            if (typeof argValue === "object") {
                iterate(argValue, callback);
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
        iterate(args, (argName: string, argValue: any) => {
            if (
                !isEmpty(args)
                && !isEmpty(newArgs)
            ) {
                if (
                    !isEmpty(newArgs[argName as keyof typeof newArgs])
                ) {
                    args[argName as keyof typeof args] = newArgs[argName as keyof typeof newArgs];
                }
            }
        });
        return args;
    } catch(e) {
        console.error(e)
    }
}












interface Session {
    customElementsOccurrences: Array<HTMLElement>;
}

var sess = new class Session implements Session {
    name: string = "Session"
    customElementsOccurrences: Array<HTMLElement> = [];
}

type PivotTemplateArgument = string | null;

type PivotDataArgument = any | null;

type PivotHandlerArgument = object | null;

type PivotArgument = PivotTemplateArgument | PivotDataArgument | PivotHandlerArgument | null;

interface PivotArguments {
    template?: PivotTemplateArgument;
    data?: PivotDataArgument;
    handler?: PivotHandlerArgument;
}
interface Pivot {
    args?: PivotArguments;
    new<T extends PivotArguments>(args: T): { args: T };
}

class Pivot implements Pivot {
    name: string = "Pivot";

    args?: PivotArguments = {};

    constructor(args?: PivotArguments) {
        if (
            args === undefined
            || args === null
        ) return;

        sess.customElementsOccurrences = [];
        customElements.define(`template-${args.template}`, class extends HTMLElement {
            constructor() {
                super();
            }
            connectedCallback() {
                sess.customElementsOccurrences.push(this);
            }
        });

        customElements.whenDefined(`template-${args.template}`).then(() => {
            sess.customElementsOccurrences.map(occur => {
                this.args = {...args};

                if (
                    this.args !== undefined
                    && this.args !== null
                ) {
                    if (
                        this.args.data !== undefined
                        && this.args.data !== null
                    ) {
                        this.args.data = merge(this.args.data, occur.dataset);
                    }

                    if (
                        this.args.handler !== undefined
                        && this.args.handler !== null
                    ) {
                        iterate(this.args.handler, (handlerName, handlerValue) => {
                            if (
                                this.args !== undefined
                                && this.args !== null
                            ) {
                                switch(handlerName) {
                                    case "init":
                                        handlerValue.apply(this.args.data);
                                        break;
    
                                    default:
                                        break;
                                }
                            }
                        })
                    }
                }
            });
        });
    }
}