import { overwrite } from "../utils/index";

/**
 * Global Declarations
 */
declare global {
    interface Window { PivotSession: any; }
}

export namespace PivotCore
{
    export class Controller
    {
        constructor()
        {
            PivotSession.UseController(new.target);
        }
        data(): object
        {
            return {}
        }
        whenDefined(self: HTMLElement, data: object): void
        {
            /** Do something */
        }
    }

    class PivotSessionHandlers
    {
        static UseElement(text: string, dataset: DOMStringMap): string
        {
            return text.replace(/\{\{(.*?)\}\}/g, function(match: string, value: string): string {
                return dataset[value.trim()] ?? value;
            });
        }

        static UseController(ctrl: any)
        {
            window.PivotSession.inUse.map((self: HTMLElement) => {
                if (ctrl.name === self.getAttribute("use")) {
                    ctrl.prototype.whenDefined(self, overwrite(ctrl.prototype.data(), self.dataset));
                }
            });
        }
    }

    class PivotSession extends PivotSessionHandlers
    {
        occurs?: Array<object>;
        inUse?:  Array<object>;
    
        constructor()
        {
            super();

            const _occurs: Array<object> = [];
            const _inUse: Array<object> = [];
    
            customElements.define(`pvt-new`, class extends HTMLElement {
                public constructor() 
                { 
                    super();
                }
    
                /** Populate */
                public connectedCallback(): void
                {
                    if (this.hasAttribute("use")) {
                        /** Do something */
                        _inUse.push(this);
                    }
                    
                    if (this.hasAttribute("extends")) {
                        const _extends: string = this.getAttribute("extends") ?? "";
    
                        fetch(
                            _extends
                        )
                        .then(response => {
                            return response.text();
                        })
                        .then(textElement => {
                            this.innerHTML = PivotSession.UseElement(textElement, this.dataset);
                        })
                        .catch(error => {
                            console.error(error);
                        })
                    }
    
                    _occurs.push(this);
                }
            });
    
            this.occurs = _occurs;
            this.inUse = _inUse;
        }
    }

    window.PivotSession = window.PivotSession || new PivotSession;
}
