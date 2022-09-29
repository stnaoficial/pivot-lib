"use strict";
const nullValues = ["", 0, null];
function isEmpty(arg) {
    return (arg === undefined) ? true : false;
}
function isNull(arg) {
    return (nullValues.indexOf(arg) !== -1) ? true : false;
}
function preventTo(arg, type) {
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
function restrictTo(arg, type, notNull = false) {
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
function iterate(args, callback) {
    try {
        if (isEmpty(args))
            throw `The arguments cannot be ${typeof args}`;
        if (isEmpty(callback))
            throw `The callback cannot be ${typeof callback}`;
        Object.entries(args).map(([argName, argValue]) => {
            if (typeof argValue === "object") {
                iterate(argValue, callback);
            }
            else {
                callback(argName, argValue);
            }
        });
    }
    catch (e) {
        console.error(e);
    }
}
function merge(args, newArgs) {
    try {
        iterate(args, (argName, argValue) => {
            if (!isEmpty(args)
                && !isEmpty(newArgs)) {
                if (!isEmpty(newArgs[argName])) {
                    args[argName] = newArgs[argName];
                }
            }
        });
        return args;
    }
    catch (e) {
        console.error(e);
    }
}
var sess = new class Session {
    constructor() {
        this.name = "Session";
        this.customElementsOccurrences = [];
    }
};
class Pivot {
    constructor(args) {
        this.name = "Pivot";
        this.args = {};
        if (args === undefined
            || args === null)
            return;
        sess.customElementsOccurrences = [];
        customElements.define(`template-${args.template}`, class extends HTMLElement {
            constructor() {
                super();
            }
            connectedCallback() {
                sess.customElementsOccurrences.push(this);
            }
        });
        customElements.whenDefined(`template-${args.template}`).then(() => {
            sess.customElementsOccurrences.map(occur => {
                this.args = { ...args };
                if (this.args !== undefined
                    && this.args !== null) {
                    if (this.args.data !== undefined
                        && this.args.data !== null) {
                        this.args.data = merge(this.args.data, occur.dataset);
                    }
                    if (this.args.handler !== undefined
                        && this.args.handler !== null) {
                        iterate(this.args.handler, (handlerName, handlerValue) => {
                            if (this.args !== undefined
                                && this.args !== null) {
                                switch (handlerName) {
                                    case "init":
                                        handlerValue.apply(this.args.data);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        });
                    }
                }
            });
        });
    }
}
