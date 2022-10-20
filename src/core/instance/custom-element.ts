export { PivotElement }

class PivotElementHelper
{
    static TextFragmentToHTML(HTMLTextFragment: string): DocumentFragment
    {
        var HTMLFragment = document.createElement('template');
        HTMLFragment.innerHTML = HTMLTextFragment;
        return HTMLFragment.content;
    }
}

class PivotElement extends PivotElementHelper
{
    element!: HTMLElement;
    fragment?: string | Node = "";

    constructor(element: HTMLElement)
    {
        super();

        this.element = element;

        if (this.element.hasAttribute("use-fragment")) {
            this
            .fetchFragment(
                this.element.getAttribute("use-fragment") ?? ""
            )
            .then((HTMLTextFragment) => {
                return this.collateData(HTMLTextFragment);
            })
            .then((HTMLTextFragment) => {
                const oldInnerHTML = this.element.innerHTML;
                this.element.replaceChildren(PivotElement.TextFragmentToHTML(HTMLTextFragment));
                this.element.innerHTML = this.collateInnerHTMLFragment(this.element.innerHTML, oldInnerHTML);
            })
            .then(() => {
                this.collateData(this.element.innerHTML);
            })
            .catch((err) => {
                console.error(err);
            })
        }

        this.collateData(this.element.innerHTML);
    }

    fetchFragment(url: RequestInfo | URL): Promise<string>
    {
        return new Promise((resolve, reject) => {
            fetch(url)
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

    collateData(HTMLTextFragment: string): string
    {
        return HTMLTextFragment.replace(
            /\{\{(.*?)\}\}/g, 
            (match: string, value: string): string => {
                return this.element.dataset[value.trim()] ?? value.trim();
            }
        );
    }

    collateInnerHTMLFragment(HTMLTextFragment: string, InnerHTMLTextFragment: string): string
    {
        return HTMLTextFragment.replace(
            /\[children\]/g, 
            InnerHTMLTextFragment
        );
    }
}