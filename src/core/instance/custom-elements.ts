export namespace CustomElements
{
    class CustomElementHelper
    {
        static TextFragmentToHTML(HTMLTextFragment: string): DocumentFragment
        {
            var HTMLFragment = document.createElement('template');
            HTMLFragment.innerHTML = HTMLTextFragment;
            return HTMLFragment.content;
        }
    }
    
    class CustomElement extends CustomElementHelper
    {
        element: HTMLElement;
    
        constructor(element: HTMLElement)
        {
            super();
    
            this.element = element;
    
            if (this.element.hasAttribute("src")) {
                this
                .fetchFragment(
                    this.element.getAttribute("src") ?? ""
                )
                .then((HTMLTextFragment) => {
                    return this.collateFragmentData(HTMLTextFragment);
                })
                .then((HTMLTextFragment) => {
                    const oldInnerHTML = this.element.innerHTML;
                    this.element.replaceChildren(CustomElementHelper.TextFragmentToHTML(HTMLTextFragment));
                    this.element.innerHTML = this.collateInnerHTMLFragment(this.element.innerHTML, oldInnerHTML);
                })
                .then(() => {
                    this.collateFragmentData(this.element.innerHTML);
                })
                .catch((err) => {
                    console.error(err);
                })
            }
    
            this.collateFragmentData(this.element.innerHTML);
        }
    
        fetchFragment(input: RequestInfo | URL): Promise<string>
        {
            return new Promise((resolve, reject) => {
                fetch(input)
                .then((response) => {
                    return response.text();
                })
                .then((TextHTMLStructure) => {
                    resolve(TextHTMLStructure);
                })
                .catch((err) => {
                    console.error(err)
                })
            })
        }
    
        collateFragmentData(HTMLTextFragment: string): string
        {
            return HTMLTextFragment.replace(
                /\{\{(.*?)\}\}/g, 
                (match: string, value: string): string => {
                    if (this.element.hasAttribute(`frag-${value.trim()}`) === false) console.warn(`Missing ${match}.`);
                    return this.element.getAttribute(`frag-${value.trim()}`) ?? value.trim();
                }
            );
        }
    
        collateInnerHTMLFragment(HTMLTextFragment: string, InnerHTMLTextFragment: string): string
        {
            return HTMLTextFragment.replace(
                /\.\.\.children/g, 
                InnerHTMLTextFragment
            );
        }
    }

    export const Define = (tagName: string): void => {
        customElements.define(
            tagName,
            class extends HTMLElement
            {
                constructor()
                {
                    super();
                }
                connectedCallback(): void
                {
                    new CustomElement(this);
                }
            }
        );
    }
}