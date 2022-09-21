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

function getAttributes(attrPrefix: string, namedNodeMap: NamedNodeMap): Array<Attr> {
    let regExp = new RegExp(`${attrPrefix}-.*`, "g")
    return Object.values(namedNodeMap).filter(attr => { if (attr.name.match(regExp)) return attr; });
}

declare namespace PivotCore {
    interface GlobalInstance {
        sess:       PivotCore.GlobalSession;
        prototype?: PivotCore.GlobalInstanceArguments;
    }

    interface GlobalInstanceArguments {
        template: string;
    }

    interface GlobalSession {
        occurs: Array<PivotCore.Occurrence>;
    }

    interface Occurrence{
        el?:    object      | null | undefined;
        attrs?: Array<Attr> | null | undefined;
        funcs?: Array<Attr> | null | undefined;
    }

    interface OccurrenceArguments{}
}

class HTMLPivotElement extends HTMLElement {
    occur: PivotCore.Occurrence = new PivotOccurrence();

    constructor() {
        super();
    }

    connectedCallback() {
        // Custom element added to page.
        this.occur.el    = this;
        this.occur.attrs = getAttributes("attr", this.attributes);
        this.occur.funcs = getAttributes("func", this.attributes);
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

    static get observedAttributes() { return ['c', 'l']; }
}

class PivotSession implements PivotCore.GlobalSession {
    occurs: PivotCore.Occurrence[];

    constructor() {
        this.occurs = [];
    }
}

class PivotOccurrence implements PivotCore.Occurrence {
    el?:    object      | null | undefined;
    attrs?: Array<Attr> | null | undefined;
    funcs?: Array<Attr> | null | undefined;

    constructor() {
        this.el    = null;
        this.attrs = null;
        this.funcs = null;
    }
}

class Pivot implements PivotCore.GlobalInstance {
    sess: PivotCore.GlobalSession = new PivotSession();

    readonly nodeName?: string;

    constructor(args?: PivotCore.GlobalInstanceArguments) {
        if (args === undefined) return;

        this.nodeName = "template-" + args.template;

        customElements.define(this.nodeName, HTMLPivotElement);

        customElements.whenDefined(this.nodeName).then(() => {
            console.trace("Elements defined!")
        })
    }
}
const pivot = new Pivot();