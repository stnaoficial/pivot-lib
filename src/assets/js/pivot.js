"use strict";
// // Globals
// const emptyValues = [undefined];
// const nullValues  = ["", 0, null];
// /**
//  * Checks if an argument can be asign
//  * @function notEmpty()
//  * @param { any } arg The taret arg
//  */
// function notEmpty( arg: any ): boolean { return ( emptyValues.indexOf( arg ) === -1 )? true : false; }
// /**
//  * Checks if an argument is null
//  * @function isNull()
//  * @param { any } arg The taret arg
//  */
// function isNull( arg: any ): boolean { return ( nullValues.indexOf( arg ) !== -1 )? true : false; }
// /**
//  * Checks rules
//  * @function fitsIn()          Custom validation
//  * @param { any }      arg     The taret argument
//  * @param { string }   type    The type focus
//  * @param { boolean }  notNull If is a not null value
//  */
// function fitsIn( arg: any, type: string, notNull: boolean = false ): boolean
// {
//     try {
//         if ( notEmpty( arg ) && isNull( arg ) && notNull === true ) {
//             throw `The argument cannot be null`;
//         }
//         if ( notEmpty( arg ) && typeof arg !== type ) {
//             throw `The argument type must be a ${ type }. Getting "${ arg }" with type ${ typeof arg }`;
//         }
//         return true;
//     } catch(e) {
//         console.error(e);
//         return false;
//     }
// }
// declare namespace Ekran
// {
//     interface AnimationArguments
//     {
//         target:   string;
//         interval?: number;
//         timeout?:  number;
//         init?:     any;
//     }
//     interface AnimationConstructor
//     {
//         new( args: AnimationArguments ): void;
//     }
//     interface Animation{}
// }
class PivotGlobals {
    constructor() {
        this.prefix = "template";
    }
}
const pivotGlobals = new PivotGlobals;
class PivotSession {
    constructor() {
        this.occurs = [];
    }
}
const pivotSession = new PivotSession;
class PivotElement extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        // Custom element added to page.
        pivotSession.occurs.push(this);
    }
    disconnectedCallback() {
        // Custom element removed from page.
        console.warn(this);
    }
    adoptedCallback() {
        // Custom element moved to new page.
        console.warn(this);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // Custom element attributes changed.
        console.warn(this);
    }
    static get observedAttributes() { return ['c', 'l']; }
}
class Pivot {
    template(args) {
        this.elementName = `${pivotGlobals.prefix}-${args.target}`;
        customElements.define(this.elementName, PivotElement);
        pivotSession.occurs.filter((occur) => {
            if (this.elementName.toUpperCase() === occur.nodeName)
                return this.set(occur, args);
        });
    }
    set(occur, args) {
        if (args.init !== undefined) {
            this.occur = occur;
            args.init.apply(this);
        }
    }
}
const pivot = new Pivot();
