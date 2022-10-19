import { PivotCore } from "../pivot-core";
import { PivotVDOM } from "../pivot-vdom/pvt-vdom";

export namespace PivotOccurrence
{
    class OccurrenceHandler
    {
        static Map(occur: HTMLElement): void
        {
            if (occur.hasAttribute("use")) {
                Occurrence
                .Uses(occur.getAttribute("use"))
                .then((pivot) => {
                    pivot.prototype
                    .whenDefined(
                        occur,
                        pivot.prototype.data()
                    );
                })
            }
            
            if (occur.hasAttribute("includes")) {
                Occurrence
                .Includes(occur.getAttribute("includes"))
                .then((HTMLTextStructure) => {
                    if (HTMLTextStructure !== null) {
                        var HTMLTextStructureCollated: string = "";
                        
                        if (PivotVDOM.VDOM.HasData(HTMLTextStructure))
                        {
                            HTMLTextStructureCollated =
                            PivotVDOM.VDOM.CollateData(
                                HTMLTextStructure,
                                occur.dataset
                            );
                        }
                        
                        if (PivotVDOM.VDOM.HasChildren(HTMLTextStructureCollated))
                        {
                            HTMLTextStructureCollated =
                            PivotVDOM.VDOM.AppendChildren(
                                HTMLTextStructureCollated,
                                occur.innerHTML
                            );
                        }

                        occur.innerHTML = HTMLTextStructureCollated;
                    }
                })
            }

            occur.innerHTML =
            PivotVDOM.VDOM.CollateData(
                occur.innerHTML,
                occur.dataset
            );
        }

        static Uses(pivotName: string | null): Promise<any>
        {
            return new Promise((resolve, reject) => {
                if (window.Pivot !== undefined) {
                    window
                    .Pivot.sess.occurs
                    .map(([occurName, occurValue]: [occurName: string, occurValue: object]) => {
                        if (pivotName === occurName) resolve(occurValue);
                    })
                }
            })
        }

        static Includes(input: RequestInfo | URL | null): Promise<string | null >
        {
            return new Promise((resolve, reject) => {
                if (input !== null) {
                    fetch(
                        input
                    )
                    .then(response => {
                        return response.text();
                    })
                    .then(HTMLTextStructure => {
                        resolve(HTMLTextStructure);
                    })
                    .catch(error => {
                        console.error(error);
                    });
                }
            })
        }
    }

    export class Occurrence extends OccurrenceHandler
    {        
        constructor(pivotOccurName: string)
        {
            super();

            customElements.define(pivotOccurName, class extends HTMLElement
            {
                public constructor()
                { 
                    super();
                }
    
                public connectedCallback(): void
                {
                    Occurrence.Map(this);
                }
            });
        }
    }
}