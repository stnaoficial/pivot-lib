"use strict";
const nullValues = ["", 0, null];
function isEmpty(arg) {
    return (arg === undefined) ? true : false;
}
function isNull(arg) {
    return (nullValues.indexOf(arg) !== -1) ? true : false;
}
// function preventTo(arg: any, type: string): boolean {
//     try {
//         if (!isEmpty(arg) && typeof arg === type) throw `The argument cannot be ${type}. Getting "${arg}" with type "${typeof arg}"`;
//         return true;
//     } catch(e) {
//         console.error(e);
//         return false;
//     }
// }
// function restrictTo(arg: any, type: string, notNull: boolean = false): boolean {
//     try {
//         if (!isEmpty(arg) && isNull(arg) && notNull === true) throw `The argument cannot be ${typeof arg}`;
//         if (!isEmpty(arg) && typeof arg !== type) throw `The argument type must be a ${type}. Getting "${arg}" with type "${typeof arg}"`;
//         return true;
//     } catch(e) {
//         console.error(e);
//         return false;
//     }
// }
function iterate(callback, args) {
    try {
        if (args === undefined)
            throw `The arguments cannot be ${typeof args}`;
        if (callback === undefined)
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
        if (args !== undefined
            && newArgs !== undefined) {
            iterate((argName, argValue) => {
                if (newArgs[argName] !== undefined) {
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
    const intervalId = setInterval(() => { callback(intialValue); intialValue++; if (intialValue >= lastValue)
        clearInterval(intervalId); }, interval);
}
function inViewport(el) {
    const rect = el.getBoundingClientRect();
    return (rect.top >= 0
        && rect.left >= 0
        && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        && rect.right <= (window.innerWidth || document.documentElement.clientWidth));
}
function pascalCaseToKebabCase(pascalCase) {
    return pascalCase.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}
class Pivot {
    constructor(data) {
        this.name = "Pivot";
        if (data !== undefined)
            this.init(data);
    }
    init(data) {
        const childConstructor = this.constructor;
        const tagName = pascalCaseToKebabCase(this.name) + "-" + pascalCaseToKebabCase(childConstructor.name);
        customElements.define(tagName, class extends HTMLElement {
            constructor() { super(); }
            connectedCallback() {
                if (data === undefined)
                    return;
                childConstructor.prototype.whenDefined.apply({ data: merge(childConstructor.prototype.dataWillBeDefined({ ...data }), this.dataset) }, [this]);
            }
        });
    }
    dataWillBeDefined(data) { return data; }
    whenDefined(target) { }
}
