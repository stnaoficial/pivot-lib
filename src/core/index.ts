import { PivotElement } from "./instance/custom-element";

export {};

/**
 * Modify glabal scope declaration
 * @required
 * @ignore
 */
declare global
{
    interface Window
    {
        Pivot: any;
    }
}

/** 
 * Initializes all necessary procedures. Creates an
 * Pivot instance in the window
 * @required
 * @ignore 
 */
window.Pivot = window.Pivot || (() => {
    /** Events before, private */

    customElements.define(
        "pivot-element",
        class extends HTMLElement
        {
            constructor()
            {
                super();
            }
            connectedCallback(): void
            {
                new PivotElement(this);
            }
        }
    );

})() || new class {
    /** Events after, public */
    elements: [HTMLElement][] = [];

}