"use strict";
const nullValues = ["", 0, null];
function isNull(arg) {
    return (nullValues.indexOf(arg) !== -1) ? true : false;
}
function iterate(callback, args) {
    try {
        if (args === undefined)
            throw `The iterate arguments cannot be ${typeof args}`;
        if (callback === undefined)
            throw `The iterate callback cannot be ${typeof callback}`;
        Object.entries(args).map(([argName, argValue]) => { if (typeof argValue === "object") {
            iterate(callback, argValue);
        }
        else {
            callback(argName, argValue);
        } });
    }
    catch (e) {
        console.error(e);
    }
}
function overwrite(args, newArgs) {
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
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
            callback(intialValue);
            intialValue++;
            if (intialValue >= lastValue) {
                resolve("complete");
                clearInterval(intervalId);
            }
        }, interval);
    });
}
function inViewport(el) {
    if (el instanceof HTMLElement === false)
        throw `Cannot use ${el}. ${el} are not of type HTMLElement`;
    return new Promise((resolve, reject) => {
        check();
        window.addEventListener("scroll", () => { check(); });
        function check() {
            const rect = el.getBoundingClientRect();
            if (rect.top >= 0
                && rect.left >= 0
                && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
                && rect.right <= (window.innerWidth || document.documentElement.clientWidth)) {
                resolve(true);
            }
        }
    });
}
function pascalCaseToKebabCase(pascalCase) {
    return pascalCase.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}
var PivotCore;
(function (PivotCore) {
    class Pivot {
        constructor(data) {
            this.name = "Pivot";
            if (data !== undefined)
                this.init(data);
        }
        init(data) {
            const pivot = this.constructor.prototype;
            const tagNamePrefix = pascalCaseToKebabCase(this.name);
            const tagNameSufix = pascalCaseToKebabCase(pivot.constructor.name);
            const tagName = `${tagNamePrefix}-${tagNameSufix}`;
            customElements.define(tagName, class extends HTMLElement {
                constructor() { super(); }
                connectedCallback() {
                    if (data === undefined)
                        return;
                    customElements.whenDefined(tagName).then(() => {
                        // Overwrites data property to whenDefined method
                        pivot.whenDefined.apply({ data: overwrite(pivot.dataWillBeDefined({ ...data }), this.dataset) }, [this]);
                    });
                }
            });
        }
        dataWillBeDefined(data) { return data; }
        whenDefined(target) { }
    }
    PivotCore.Pivot = Pivot;
})(PivotCore || (PivotCore = {}));
