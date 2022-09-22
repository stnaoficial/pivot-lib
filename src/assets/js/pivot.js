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
function branchAttributes(attrPrefix, namedNodeMap) {
    return Object.values(namedNodeMap).filter(attr => { if (attr.name.match(new RegExp(`${attrPrefix}-.*`, "g")))
        return attr; });
}
class PivotOccurence {
    constructor() {
        this.template = null;
        this.attrs = null;
        this.funcs = null;
    }
}
class PivotSession {
    constructor() {
        this.occurs = [];
    }
}
class PivotHandlers {
    constructor() {
        this.template = null;
        this.attrs = null;
        this.funcs = null;
    }
}
class Pivot {
    constructor(args) {
        this.sess = new PivotSession();
        this.args = new PivotHandlers();
        if (args === undefined)
            return;
        this.args = args;
        this.localName = "template-" + this.args.template;
        customElements.define(this.localName, class extends HTMLElement {
            constructor() {
                super();
                this.occur = new PivotOccurence();
            }
            connectedCallback() {
                // Custom element added to page.
                this.occur.template = this;
                this.occur.attrs = branchAttributes("attr", this.attributes);
                this.occur.funcs = branchAttributes("func", this.attributes);
                pivot.sess.occurs.push(this.occur);
            }
        });
        customElements.whenDefined(this.localName).then(() => {
            pivot.sess.occurs.map((occur) => { this.interpret(occur); });
        });
    }
    interpret(occur) {
        if (occur.template !== null
            && occur.template.localName === this.localName) {
            console.log(occur.template, this.args);
        }
    }
}
const pivot = new Pivot();
