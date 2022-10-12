import { overwrite, pascalCaseToKebabCase, script } from "../utils/pivot-utils";

export namespace PivotCore {
    export interface Pivot {
        new<T extends object>(data?: T): { data: T };
        defineDefaultData(data: object): void;
        dataWillBeDefined<T extends object>(data: T): T;
        whenDefined(element?: HTMLElement): void;
    }
    export class Pivot implements Pivot {
        name: string = "Pivot";
        public constructor(data?: object) {
            if (data !== undefined) this.defineDefaultData(data);
        }
        public defineDefaultData(data: object): void {
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
                        instance = script(this.getAttribute("script"), instance);
                    }

                    child.whenDefined.apply(instance, [this]);
                }
            });
        }
        public dataWillBeDefined(data: object): object {
            return data;
        }
        public whenDefined(element?: HTMLElement): void {
            /** Do something */
        }
    }
}