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
function iterate(callback, args) {
    try {
        if (isEmpty(args))
            throw `The arguments cannot be ${typeof args}`;
        if (isEmpty(callback))
            throw `The callback cannot be ${typeof callback}`;
        Object.entries(args).map(([argName, argValue]) => {
            if (typeof argValue === "object") {
                iterate(callback, argValue);
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
        if (!isEmpty(args)
            && !isEmpty(newArgs)) {
            iterate((argName, argValue) => {
                if (!isEmpty(newArgs[argName])) {
                    args[argName] = newArgs[argName];
                }
            }, newArgs);
        }
        return args;
    }
    catch (e) {
        console.error(e);
    }
}
function setCounter(callback, intialValue, lastValue, interval) {
    let newValue = intialValue;
    let intervalId = setInterval(() => { callback(newValue); newValue++; if (newValue >= lastValue)
        clearInterval(intervalId); }, interval);
}
function inViewport(el) {
    const rect = el.getBoundingClientRect();
    return (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth));
}
class PivotSession {
    constructor() {
        this.name = "PivotSession";
    }
    static UseCustomElementTemplateName(templateName) {
        let occurs = [];
        customElements.define(templateName, class extends HTMLElement {
            constructor() { super(); }
            connectedCallback() { occurs.push(this); }
        });
        return occurs;
    }
}
class Pivot {
    constructor(args) {
        this.name = "Pivot";
        this.args = {};
        if (args === undefined)
            return;
        let templateName = `template-${args.template}`;
        let occurs = PivotSession.UseCustomElementTemplateName(templateName);
        customElements.whenDefined(templateName).then(() => {
            this.args = { ...args };
            occurs.map(occur => {
                if (this.args === undefined)
                    return;
                this.args.dataset = { ...args.dataset };
                this.args.dataset = merge(this.args.dataset, occur.dataset);
                this.whenDefined(occur);
            });
        });
    }
    whenDefined(occur) { }
}
