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
    let regExp = new RegExp(`${attrPrefix}-.*`, "g")
    return Object.values(namedNodeMap).filter(attr => { if (attr.name.match(regExp)) return attr; });
}












declare namespace PivotCore {
    interface GlobalInstance {
        sess:       PivotCore.GlobalInstanceSession;
        prototype?: PivotCore.GlobalInstancePrototype;
    }

    type GlobalInstancePrototype = {
        template?: string;
        attrs?:    object;
        funcs?:    object;
    }

    type GlobalInstanceSession = {
        occurs: Array<PivotCore.GlobalInstanceOccurrence>;
    }

    type GlobalInstanceOccurrence = {
        template: HTMLElement;
        attrs:    Array<Attr>;
        funcs:    Array<Attr>;
    }
}









class PivotSession implements PivotCore.GlobalInstanceSession {
    occurs: PivotCore.GlobalInstanceOccurrence[] = [];
}

class PivotGlobalInstanceOccurrence implements PivotCore.GlobalInstanceOccurrence {
    template!: HTMLElement;
    attrs!:    Array<Attr>;
    funcs!:    Array<Attr>;
}

class Pivot implements PivotCore.GlobalInstancePrototype {
    public readonly sess: PivotCore.GlobalInstanceSession = new PivotSession();

    protected localName?: string;

    constructor(args?: PivotCore.GlobalInstancePrototype) {
        if (args === undefined) return;

        this.localName = "template-" + args.template;

        customElements.define(this.localName, class extends HTMLElement {
            occur: PivotCore.GlobalInstanceOccurrence = new PivotGlobalInstanceOccurrence();
        
            constructor() {
                super();
            }
        
            connectedCallback() {
                // Custom element added to page.
                this.occur.template = this;
                this.occur.attrs    = branchAttributes("attr", this.attributes);
                this.occur.funcs    = branchAttributes("func", this.attributes);
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
            pivot.sess.occurs.map((occur: PivotCore.GlobalInstanceOccurrence) => { if (occur.template.localName === this.localName) this.intercept(occur, args) })
        })
    }

    private intercept(occur: PivotCore.GlobalInstanceOccurrence, args: PivotCore.GlobalInstancePrototype): void {
        Object.entries(args).map(([argName, argValue]) => {
            console.log(occur[argName as keyof PivotCore.GlobalInstanceOccurrence]);

            if (typeof argValue === "object") this.intercept(occur, argValue);
        });
    }
}
const pivot = new Pivot();