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

type PivotOccurenceHandler = PivotOccurenceTemplateHandler | PivotOccurenceAttributesHandler | PivotOccurenceFunctionsHandler | null;

type PivotOccurenceHandlers = {
    template: PivotOccurenceTemplateHandler;
    attrs: PivotOccurenceAttributesHandler;
    funcs: PivotOccurenceFunctionsHandler; 
}
interface PivotOccurence {
    new<T extends PivotOccurenceHandlers>(handlers: T): { handlers: T };
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
    occur?: PivotOccurence;
    handlers?: PivotHandlers;
    handler?: PivotHandler;
}

class PivotSession implements PivotSession {
    occurs: Array<PivotOccurence> = [];
    occur?: PivotOccurence;
    handlers?: PivotHandlers;
    handler?: PivotHandler;
}

type PivotTemplateHandler = string | null;

type PivotAttributesHandler = object | null;

type PivotFunctionsHandler = object | null;

type PivotHandler = PivotTemplateHandler | PivotAttributesHandler | PivotFunctionsHandler | null;

interface PivotHandlers {
    template: PivotTemplateHandler;
    attrs: PivotAttributesHandler;
    funcs: PivotFunctionsHandler;
}
interface Pivot {
    sess: PivotSession;
    localName?: string;
    new<T extends PivotHandlers>(handlers: T): { handlers: T };
    applyHandlers(handlers: PivotHandlers): void;
    handlerWillBeApplied(handler: PivotHandler, occurHandler: PivotOccurence): void;
}

class Pivot implements Pivot {
    public sess: PivotSession = new PivotSession();

    localName?: string;

    constructor(handlers?: PivotHandlers) {
        if (handlers !== undefined) this.applyHandlers(handlers);
    }

    applyHandlers(handlers: PivotHandlers) {
        this.sess.handlers = handlers;

        this.localName = "template-" + this.sess.handlers.template;
        customElements.define(this.localName, class extends HTMLElement {
            occur: PivotOccurence = new PivotOccurence();

            constructor() {
                super();
            }
        
            connectedCallback() {
                // Custom element added to page.
                this.occur.template = this;
                this.occur.attrs = branchAttributes("attr", this.attributes);
                this.occur.funcs = branchAttributes("func", this.attributes);
                pivot.sess.occurs.push(this.occur);
            }
        
            disconnectedCallback() {
                // Custom element removed from page.
            }
        
            adoptedCallback() {
                // Custom element moved to new page.
            }
        
            attributeChangedCallback(name: string, oldValue: any, newValue: any) {
                // Custom element attributes changed.
            }
        });

        customElements.whenDefined(this.localName).then(() => {
            pivot.sess.occurs.filter((occur: PivotOccurence) => {
                if (
                    occur.template !== null
                    && occur.template.localName === this.localName
                ) {
                    this.sess.occur = occur;

                    if (this.sess.handlers !== undefined) {
                        Object.entries(this.sess.handlers).map(handler => {
                            if (this.sess.occur !== undefined) {
                                this.handlerWillBeApplied(handler);
                            }
                        });
                    }

                }
            });
        });
    }

    handlerWillBeApplied(handler: PivotHandler): void {
        this.sess.handler = handler;
    }
}
const pivot = new Pivot();