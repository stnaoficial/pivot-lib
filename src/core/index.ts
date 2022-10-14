import { cloneDeep, overwrite, pascalCaseToKebabCase, script } from "../utils/index";

export namespace PivotCore
{
    export class Pivot implements PivotTypes.Pivot
    {
        name: string = "Pivot";
        
        public constructor(data?: PivotTypes.PivotData)
        {
            if (data !== undefined) this.defineDefaultData(data);
        }
        
        public defineDefaultData(data: PivotTypes.PivotData): void
        {
            const child: PivotTypes.Pivot = this.constructor.prototype;
    
            const tagNamePrefix: string = pascalCaseToKebabCase(this.name);
            const tagNameSufix:  string = pascalCaseToKebabCase(child.constructor.name);
            const tagName:       string = `${tagNamePrefix}-${tagNameSufix}`;
    
            customElements.define(tagName, class extends HTMLElement {
                public constructor()
                {
                    super();
                }
                
                public connectedCallback(): void
                {
                    var sess: any = {};
    
                    sess.data = overwrite(child.dataWillBeDefined(cloneDeep(data)), this.dataset)
    
                    if (this.hasAttribute("script")) {
                        sess = script(this.getAttribute("script"), sess, [['element', this]]);
                    }
    
                    child.whenDefined.apply(sess, [this]);
                }
            });
        }
        
        public dataWillBeDefined<T extends PivotTypes.PivotData>(data: T): T
        {
            return data;
        }
        
        public whenDefined(element?: HTMLElement): void
        {
            /** Do something */
        }
    }
}