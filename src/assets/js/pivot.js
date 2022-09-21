"use strict";
const nullValues = ["", 0, null];
function isEmpty(arg) {
    return (arg === undefined) ? true : false;
}
function isNull(arg) {
    return (nullValues.indexOf(arg) !== -1) ? true : false;
}
function typify(arg, type, notNull = false) {
    try {
        if (!isEmpty(arg) && isNull(arg) && notNull === true) {
            throw `The argument cannot be null`;
        }
        if (!isEmpty(arg) && typeof arg !== type) {
            throw `The argument type must be a ${type}. Getting "${arg}" with type "${typeof arg}"`;
        }
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
function getAttributes(attrPrefix, namedNodeMap) {
    let regExp = new RegExp(`${attrPrefix}-.*`, "g");
    return Object.values(namedNodeMap).filter(attr => { if (attr.name.match(regExp))
        return attr; });
}
class HTMLPivotElement extends HTMLElement {
    constructor() {
        super();
        this.occur = new PivotOccurrence();
    }
    connectedCallback() {
        // Custom element added to page.
        this.occur.el = this;
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
    attributeChangedCallback(name, oldValue, newValue) {
        // Custom element attributes changed.
    }
    static get observedAttributes() { return ['c', 'l']; }
}
class PivotSession {
    constructor() {
        this.occurs = [];
    }
}
class PivotOccurrence {
    constructor() {
        this.el = null;
        this.attrs = null;
        this.funcs = null;
    }
}
class Pivot {
    constructor(args) {
        this.sess = new PivotSession();
        if (args === undefined)
            return;
        this.nodeName = "template-" + args.template;
        customElements.define(this.nodeName, HTMLPivotElement);
        customElements.whenDefined(this.nodeName).then(() => {
            console.trace("Elements defined!");
        });
    }
}
const pivot = new Pivot();
