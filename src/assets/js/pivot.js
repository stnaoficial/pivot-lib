"use strict";
const nullValues = ["", 0, null];
function isEmpty(arg) {
    return (arg === undefined) ? true : false;
}
function isNull(arg) {
    return (nullValues.indexOf(arg) !== -1) ? true : false;
}
function prevent(arg, type) {
    try {
        if (!isEmpty(arg) && typeof arg === type)
            throw `The argument cannot be ${type}. Getting "${arg}" with type "${typeof arg}"`;
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
function restrict(arg, type, notNull = false) {
    try {
        if (!isEmpty(arg) && isNull(arg) && notNull === true)
            throw `The argument cannot be ${typeof arg}`;
        if (!isEmpty(arg) && typeof arg !== type)
            throw `The argument type must be a ${type}. Getting "${arg}" with type "${typeof arg}"`;
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
class PivotOccurence {
    constructor() {
        this.template = null;
        this.dataset = null;
    }
}
class PivotSession {
    constructor() {
        this.occurs = [];
    }
}
class Pivot {
    constructor(args) {
        this.sess = new PivotSession();
        if (args !== undefined) {
            this.args = args;
        }
        new Promise((resolve, reject) => {
            if (this.args !== undefined) {
                resolve(this._init());
            }
        }).then(() => {
            console.log(this.args);
        });
    }
    _init() {
        if (this.args !== undefined && this.args.template !== undefined) {
            pivot.sess.occurs = [];
            customElements.define("template-" + this.args.template, class extends HTMLElement {
                constructor() {
                    super();
                    this.occur = new PivotOccurence();
                }
                connectedCallback() {
                    this.occur.template = this;
                    this.occur.dataset = this.dataset;
                    pivot.sess.occurs.push(this.occur);
                }
            });
            this.sess.occurs = pivot.sess.occurs;
            console.log(this.sess.occurs);
        }
    }
}
const pivot = new Pivot();
