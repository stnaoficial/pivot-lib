import { overwrite, pascalCaseToKebabCase, script } from "../utils/pivot-utils";

export namespace PivotCore {
    export class Pivot implements PivotTypes.PivotInterface {
        name: string = "Pivot";
        public constructor(data?: PivotTypes.PivotData) {
            if (data !== undefined) this.defineDefaultData(data);
        }
        public defineDefaultData(data: PivotTypes.PivotData): void {
            const child: Pivot = this.constructor.prototype;
    
            const tagNamePrefix: string = pascalCaseToKebabCase(this.name);
            const tagNameSufix: string = pascalCaseToKebabCase(child.constructor.name);
            const tagName: string = `${tagNamePrefix}-${tagNameSufix}`;
    
            customElements.define(tagName, class extends HTMLElement {     
                public constructor() {
                    super();
                }
                public connectedCallback(): void {
                    var instance: any = {};
    
                    instance.data = overwrite(child.dataWillBeDefined({...data}), this.dataset)
    
                    if (this.hasAttribute("script")) {
                        instance = script(this.getAttribute("script"), instance, [['element', this]]);
                    }
    
                    child.whenDefined.apply(instance, [this]);
                }
            });
        }
        public dataWillBeDefined<T extends PivotTypes.PivotData>(data: T): T {
            return data;
        }
        public whenDefined(element?: HTMLElement): void {
            /** Do something */
        }
    }
}