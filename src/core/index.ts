// import { cloneDeep, iterate, overwrite, pascalCaseToKebabCase, script } from "../utils/index";

// export namespace PivotCore
// {
//     class Component
//     {
//         public static UseTemplate(template: any, templateElement: HTMLElement)
//         {
//             customElements.define("pivot-component", class extends HTMLElement {
//                 public constructor() 
//                 { 
//                     super();
//                 }

//                 public connectedCallback(): void
//                 {
//                     if (
//                         this.hasAttribute("name")
//                         && this.getAttribute("name") === templateElement.getAttribute("for")
//                     ) {
//                         this.innerHTML = templateElement.innerHTML;
//                     }

//                     var target: any = {};
        
//                     target.data    = overwrite(template.dataWillBeDefined(cloneDeep(template.data())), this.dataset);        
//                     target.element = this;

//                     if (
//                         this.hasAttribute("script")
//                     ) {
//                         target = script(this.getAttribute("script"), target);
//                     }

//                     template.whenDefined.apply(template, [target.element, target.data]);
//                 }
                
//                 public disconnectedCallback(): void
//                 {
//                     /** Do something */
//                 }
                
//                 public adoptedCallback(): void
//                 {
//                     /** Do something */
//                 }
                
//                 public attributeChangedCallback(name: string, oldValue: string, newValue: string): void
//                 {
//                     /** Do something */
//                 }
//             });
//         }
//     }

//     export class Template
//     {
//         constructor()
//         {
//             const template: any = this.constructor.prototype || new.target;

//             customElements.define("pivot-template", class extends HTMLElement {
//                 public constructor() 
//                 { 
//                     super();
//                 }

//                 public connectedCallback(): void
//                 {
//                     if (
//                         this.hasAttribute("use")
//                     ) {
//                         Component.UseTemplate(template, this);
//                     }
//                 }
//             });
//         }

//         public data(): any
//         {
//             return {};
//         }
        
//         public dataWillBeDefined<T extends any>(data: T): T
//         {
//             return data;
//         }
        
//         public whenDefined(element?: HTMLElement, data?: any): any
//         {
//             /** Do something */
//         }

//         public setOutput(element: HTMLElement, outputName: string, outputValue: string): void
//         {
//             const outputElements = element.querySelectorAll(`[output-${outputName}]`);

//             Object.values(outputElements).map(outputElement => {
//                 outputElement.innerHTML = outputValue;
//             })
//         }
//     }
// }


new class Pivot
{
    occur: Array<object>;

    constructor()
    {
        const _occur: Array<object> = [];

        customElements.define(`pivot-new`, class extends HTMLElement {
            public constructor() 
            { 
                super();
            }

            public connectedCallback(): void
            {
                
                if (this.hasAttribute("extends")) {
                    const _extends: string = this.getAttribute("extends") ?? "";

                    fetch(
                        _extends
                    )
                    .then(response => {
                        return response.text;
                    })
                    .then(text => {
                        const parser = new DOMParser();

                        console.log(text())

                        this.append(parser.parseFromString(text, "text/html"));
                    })
                    .catch(() => {
                        console.error("Cannot extend this pivot");
                    })
                }

                _occur.push(this);
            }
        });

        this.occur = _occur;

        console.log(this)
    }
}