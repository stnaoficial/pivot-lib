import { CustomElements } from "./instance/custom-elements";

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
 * instance in the global window environment variable
 * @required
 * @ignore 
 */
window.Pivot = window.Pivot || (() => {
    /** Procedures before */
    CustomElements.Define("html-fragment");

})() || new class {
    /** Procedures after */
    elements: [HTMLElement][] = [];

}