import HTMLFragments from "./instance/html-fragments";

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
    HTMLFragments();

})() || new class {
    /** Procedures after */
}