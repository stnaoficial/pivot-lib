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
        if (args !== undefined)
            this.setArguments(args);
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
    setArguments(args) {
        this.args = args;
        Object.entries(this.args).map((arg) => {
            let [argName, argValue] = arg;
            if (argName === undefined)
                throw `Argument name cannot be undefined`;
            if (argValue === undefined)
                throw `Argument value cannot be undefined`;
            this.setArgument(argName, argValue);
        });
    }
    argumentWillBeSet(argName, argValue) {
        return [argName, argValue];
    }
    setArgument(argName, argValue) {
        if (argName === undefined)
            throw `Argument name cannot be undefined`;
        if (argValue === undefined)
            throw `Argument value cannot be undefined`;
        if (this.args === undefined)
            this.args = {};
        [argName, argValue] = this.argumentWillBeSet(argName, argValue);
        this.args[argName] = argValue;
    }
}
const pivot = new Pivot();
