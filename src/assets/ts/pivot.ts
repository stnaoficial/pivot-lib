const nullValues  = ["", 0, null];

function isEmpty(arg: any): boolean {
    return (arg === undefined)? true : false;
}

function isNull(arg: any): boolean {
    return (nullValues.indexOf(arg) !== -1)? true : false;
}

function prevent(arg: any, type: any): boolean {
    try {
        if (!isEmpty(arg) && typeof arg === type) throw `The argument cannot be ${type}. Getting "${arg}" with type "${typeof arg}"`;
        return true;
    } catch(e) {
        console.error(e);
        return false;
    }
}

function restrict(arg: any, type: string, notNull: boolean = false): boolean {
    try {
        if (!isEmpty(arg) && isNull(arg) && notNull === true) throw `The argument cannot be ${typeof arg}`;
        if (!isEmpty(arg) && typeof arg !== type) throw `The argument type must be a ${type}. Getting "${arg}" with type "${typeof arg}"`;
        return true;
    } catch(e) {
        console.error(e);
        return false;
    }
}

type PivotOccurenceTemplateHandler = HTMLElement | null;

type PivotOccurenceDatasetHandler = DOMStringMap | null;

type PivotOccurenceHandler = PivotOccurenceTemplateHandler | PivotOccurenceDatasetHandler | null;

type PivotOccurenceHandlers = {
    template: PivotOccurenceTemplateHandler;
    dataset: PivotOccurenceDatasetHandler;
}
interface PivotOccurence {
    template: PivotOccurenceTemplateHandler;
    dataset: PivotOccurenceDatasetHandler;
}

class PivotOccurence implements PivotOccurence {
    template: PivotOccurenceTemplateHandler;
    dataset: PivotOccurenceDatasetHandler;

    constructor() {
        this.template = null;
        this.dataset  = null;
    }
}
interface PivotSession {
    occurs: Array<PivotOccurence>;
}

class PivotSession implements PivotSession {
    occurs: Array<PivotOccurence> = [];
}

type PivotTemplateArgument = string | null;

type PivotDatasetArgument = any | null;

type PivotArgument = PivotTemplateArgument | PivotDatasetArgument | null;

interface PivotArguments {
    template?: PivotTemplateArgument;
    dataset?: PivotDatasetArgument;
}
interface Pivot {
    sess: PivotSession;
    args?: PivotArguments;
    new<T extends PivotArguments>(args: T): { args: T };
    start(): void;
    setArguments(args: PivotArguments): void;
    argumentWillBeSet(argName: string, argValue: PivotArgument): PivotArgument;
    setArgument(argName: string, argValue: PivotArgument): void;
}

class Pivot implements Pivot {
    public sess: PivotSession = new PivotSession();

    args?: PivotArguments;

    constructor(args?: PivotArguments) {
        if (args !== undefined) this.setArguments(args);
    }

    // start(): void {
    //     if (this.args === undefined || this.args.template === undefined) throw `Argument cannot be undefined`; 

    //     pivot.sess.occurs = [];
    //     customElements.define("template-" + this.args.template, class extends HTMLElement {
    //         occur: PivotOccurence = new PivotOccurence();

    //         constructor() {
    //             super();
    //         }
        
    //         connectedCallback() {
    //             this.occur.template = this;
    //             this.occur.dataset = this.dataset;
    //             pivot.sess.occurs.push(this.occur);
    //         }
    //     });

    //     this.sess.occurs = pivot.sess.occurs;
    // }
    
    setArguments(args: PivotArguments) {
        this.args = args;
        Object.entries(this.args).map((arg: PivotArgument) => {
            let [argName, argValue] = arg;
            if (argName === undefined) throw `Argument name cannot be undefined`; 
            if (argValue === undefined) throw `Argument value cannot be undefined`; 
            this.setArgument(argName, argValue);
        });
    }

    argumentWillBeSet(argName: string, argValue: PivotArgument): PivotArgument {
        return [argName, argValue];
    }

    setArgument(argName: string, argValue: PivotArgument): void {
        if (argName === undefined) throw `Argument name cannot be undefined`; 
        if (argValue === undefined) throw `Argument value cannot be undefined`;
        if (this.args === undefined) this.args = {};
        [argName, argValue] = this.argumentWillBeSet(argName, argValue);
        this.args[argName as keyof PivotArguments] = argValue;
    }
}

const pivot = new Pivot();