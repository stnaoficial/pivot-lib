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
class Pivot {
    constructor(handlers) {
        this.sess = new PivotSession();
        if (handlers !== undefined)
            this.applyHandlers(handlers);
    }
    applyHandlers(handlers) {
        this.sess.handlers = handlers;
        this.localName = "template-" + this.sess.handlers.template;
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
            pivot.sess.occurs.filter((occur) => {
                if (occur.template !== null
                    && occur.template.localName === this.localName) {
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
    handlerWillBeApplied(handler) {
        this.sess.handler = handler;
    }
}
const pivot = new Pivot();
