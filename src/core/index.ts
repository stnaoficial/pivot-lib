import { Session } from "./instance/session";

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
window.Pivot = window.Pivot || class
{
    session: any = new Session();

    static Use(entries: [any][]): void
    {
        console.trace(entries);
    }
}

/** For an easy access */
export const Pivot = window.Pivot;