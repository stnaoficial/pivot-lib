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

// class EkranAnimation implements Ekran.Animation
// {
//     static target?:   HTMLElement | null;
//     static interval?: number      | null;
//     static timeout?:  number      | null;
    
//     constructor( args: Ekran.AnimationArguments ) {
//         EkranAnimation.anim( args );
//     }
    
//     static anim( args: Ekran.AnimationArguments ): void {
//         if ( fitsIn(args.target,   "string", true) && notEmpty(args.target)   ) this.target   = document.querySelector(args.target);
//         if ( fitsIn(args.interval, "number"      ) && notEmpty(args.interval) ) this.interval = args.interval;
//         if ( fitsIn(args.timeout,  "number"      ) && notEmpty(args.timeout)  ) this.timeout  = args.timeout;
//         if ( fitsIn(args.init,     "function"    ) && notEmpty(args.init)     ) args.init.apply(this);
//     }
// }

// class EkranCore {
//     anim = EkranAnimation.anim;
// }


// const ekran = new EkranCore;
























declare namespace Pivot {
    interface Arguments {
        target: string;
        init(): void;
    }
    interface Template {
        template( args: Arguments ): void;
    }
}

class PivotGlobals {
    prefix: string = "template";
}
const pivotGlobals = new PivotGlobals;



class PivotSession {
    occurs: object[] | any;

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
    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        // Custom element attributes changed.
        console.warn(this);
    }
    static get observedAttributes() { return ['c', 'l']; }
}



class Pivot implements Pivot.Template {
    elementName: string | any;
    occur: HTMLElement | any;

    template( args: Pivot.Arguments ): void {
        this.elementName = `${ pivotGlobals.prefix }-${ args.target }`;

        customElements.define( this.elementName, PivotElement );

        pivotSession.occurs.filter( ( occur: HTMLElement ) => {
            if ( this.elementName.toUpperCase() === occur.nodeName ) return this.set( occur, args );
        });
    }
    
    private set( occur: HTMLElement, args: Pivot.Arguments ): void {
        if (args.init !== undefined) {
            this.occur = occur;

            args.init.apply(this)
        }
    }
}



const pivot = new Pivot();