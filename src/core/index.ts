import { cloneDeep, overwrite, pascalCaseToKebabCase, script } from "../utils/index";

export namespace PivotCore
{
    export class Pivot implements PivotTypes.Pivot
    {
        name: string = "Pivot";
        
        public constructor()
        {
            Pivot.UseCase(this.constructor.prototype);
        }

        private static UseCase(prototype: PivotTypes.Pivot)
        {
            const tagName: string = pascalCaseToKebabCase(this.name + prototype.constructor.name);

            customElements.define(tagName, class extends HTMLElement {
                public constructor() 
                { 
                    super();
                }

                public connectedCallback(): void
                {
                    var target: any = {};

                    target.element = this;

                    target.data = overwrite(prototype.dataWillBeDefined(cloneDeep(prototype.data())), this.dataset);

                    if (this.hasAttribute("script")) {
                        target = script(this.getAttribute("script"), target);
                    }

                    prototype.whenDefined.apply({}, [target.element, target.data]);
                }
                
                public disconnectedCallback(): void
                {
                    /** Do something */
                }
                
                public adoptedCallback(): void
                {
                    /** Do something */
                }
                
                public attributeChangedCallback(name: string, oldValue: string, newValue: string): void
                {
                    /** Do something */
                }
            });
        }

        public data(): PivotTypes.PivotData
        {
            return {};
        }
        
        public dataWillBeDefined<T extends PivotTypes.PivotData>(data: T): T
        {
            return data;
        }
        
        public whenDefined(element?: HTMLElement, data?: PivotTypes.PivotData): void
        {
            /** Do something */
        }
    }
}