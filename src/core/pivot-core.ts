import { PivotOccurrence } from "./pivot-occurrence/pivot-occurrence";
import { PivotSession } from "./pivot-session/pivot-session";
import { PivotVDOM } from "./pivot-vdom/pvt-vdom";

declare global {
    interface Window { Pivot: any; }
}

export namespace PivotCore
{
    export class Pivot
    {
        constructor()
        {
            window
            .Pivot.sess.occurs
            .push([
                new.target.name,
                new.target
            ]);
        }
        data(): object
        {
            return {}
        }
        whenDefined(occur: HTMLElement, data: any): void
        {
            /** Do something */
        }
    }
    
    /** 
     * Initializes all necessary procedures.
     * @ignore 
     */
    window.Pivot = window.Pivot || new class
    {
        sess: object;
        vdom: object;
        occur: object;

        constructor()
        {
            this.sess = new PivotSession.Session();
            this.vdom = new PivotVDOM.VDOM();
            this.occur = new PivotOccurrence.Occurrence("pvt-new");
        }
    }
}