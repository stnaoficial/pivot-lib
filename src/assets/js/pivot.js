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
    let regExp = new RegExp(`${attrPrefix}-.*`, "g");
    return Object.values(namedNodeMap).filter(attr => { if (attr.name.match(regExp))
        return attr; });
}
class PivotSession {
    constructor() {
        this.occurs = [];
    }
}
class PivotGlobalInstanceOccurrence {
}
class Pivot {
    constructor(args) {
        this.sess = new PivotSession();
        if (args === undefined)
            return;
        this.localName = "template-" + args.template;
        customElements.define(this.localName, class extends HTMLElement {
            constructor() {
                super();
                this.occur = new PivotGlobalInstanceOccurrence();
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
            attributeChangedCallback(name, oldValue, newValue) {
                // Custom element attributes changed.
            }
        });
        customElements.whenDefined(this.localName).then(() => {
            pivot.sess.occurs.map((occur) => { if (occur.template.localName === this.localName)
                this.intercept(occur, args); });
        });
    }
    intercept(occur, args) {
        Object.entries(args).map(([argName, argValue]) => {
            console.log(occur[argName]);
            if (typeof argValue === "object")
                this.intercept(occur, argValue);
        });
    }
}
const pivot = new Pivot();
