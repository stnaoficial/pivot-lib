const nullValues  = ["", 0, null];
function isEmpty(arg: any): boolean {
    return (arg === undefined)? true : false;
}
function isNull(arg: any): boolean {
    return (nullValues.indexOf(arg) !== -1)? true : false;
}
function typify(arg: any, type: string, notNull: boolean = false): boolean {
    try {
        if (!isEmpty(arg) && isNull(arg) && notNull === true) {
            throw `The argument cannot be null`;
        }
        if (!isEmpty(arg) && typeof arg !== type) {
            throw `The argument type must be a ${ type }. Getting "${ arg }" with type "${ typeof arg }"`;
        }
        return true;
    } catch(e) {
        console.error(e);
        return false;
    }
}
function branchAttributes(attrPrefix: string, namedNodeMap: NamedNodeMap): Array<Attr> {
    return Object.values(namedNodeMap).filter(attr => { if (attr.name.match(new RegExp(`${attrPrefix}-.*`, "g"))) return attr; });
}

type PivotOccurenceTemplateHandler = HTMLElement | null;

type PivotOccurenceAttributesHandler = Array<Attr> | null;

type PivotOccurenceFunctionsHandler = Array<Attr> | null;

type PivotOccurenceHandlers = {
    template: PivotOccurenceTemplateHandler;
    attrs: PivotOccurenceAttributesHandler;
    funcs: PivotOccurenceFunctionsHandler; 
}
interface PivotOccurence {
    new<T extends PivotOccurenceHandlers>(args: T): { args: T };
}

class PivotOccurence implements PivotOccurence {
    template: PivotOccurenceTemplateHandler;
    attrs: PivotOccurenceAttributesHandler;
    funcs: PivotOccurenceFunctionsHandler;

    constructor() {
        this.template = null;
        this.attrs    = null;
        this.funcs    = null;
    }
}
interface PivotSession {
    occurs: Array<PivotOccurence>;
}

class PivotSession implements PivotSession {
    occurs: Array<PivotOccurence> = [];
}

type PivotTemplateHandler = string | null;

type PivotAttributesHandler = object | null;

type PivotFunctionsHandler = object | null;

interface PivotHandlers {
    template: PivotTemplateHandler;
    attrs: PivotAttributesHandler;
    funcs: PivotFunctionsHandler;
}

class PivotHandlers implements PivotHandlers {
    template: PivotTemplateHandler;
    attrs: PivotAttributesHandler;
    funcs: PivotFunctionsHandler;

    constructor() {
        this.template = null;
        this.attrs    = null;
        this.funcs    = null;
    }
}
interface Pivot {
    sess: PivotSession;
    args: PivotHandlers;
    localName?: string;
    new<T extends PivotHandlers>(args: T): { args: T };
    interpret(occur: PivotOccurence): void;
}

class Pivot implements Pivot {
    public sess: PivotSession = new PivotSession();
    public args: PivotHandlers = new PivotHandlers();

    localName?: string;

    public constructor(args?: PivotHandlers) {
        if (args === undefined) return;

        this.args = args;

        this.localName = "template-" + this.args.template;
        customElements.define(this.localName, class extends HTMLElement {
            public occur: PivotOccurence = new PivotOccurence();

            public constructor() {
                super();
            }
        
            private connectedCallback() {
                // Custom element added to page.
                this.occur.template = this;
                this.occur.attrs = branchAttributes("attr", this.attributes);
                this.occur.funcs = branchAttributes("func", this.attributes);
                pivot.sess.occurs.push(this.occur);
            }
        
            // private disconnectedCallback() {
            //     // Custom element removed from page.
            // }
        
            // private adoptedCallback() {
            //     // Custom element moved to new page.
            // }
        
            // private attributeChangedCallback(name: string, oldValue: any, newValue: any) {
            //     // Custom element attributes changed.
            // }
        });

        customElements.whenDefined(this.localName).then(() => { 
            pivot.sess.occurs.map((occur: PivotOccurence) => { this.interpret(occur); });
        });
    }

    interpret(occur: PivotOccurence) {
        if (
            occur.template !== null 
            && occur.template.localName === this.localName
        ) {
            console.log(occur.template, this.args);
        }
    }
}
const pivot = new Pivot();