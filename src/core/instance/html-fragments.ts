export default function HTMLFragments()
{
    customElements.define("html-fragment", class extends HTMLElement { 
        constructor() { super(); }
        connectedCallback() { new HTMLFragment(this); }
    })
}

function textToDocumentFragment(text: string): DocumentFragment
{
    var templateElement = document.createElement('template');
    templateElement.innerHTML = text;
    return templateElement.content;
}

class HTMLFragment
{
    parentElement: HTMLElement;

    constructor(element: HTMLElement)
    {
        this.parentElement = element;

        if (this.parentElement.hasAttribute("src")) {
            this.fetchFragment(
                this.parentElement.getAttribute("src") ?? ""
            )
            .then((textFragment: string) => {
                return textToDocumentFragment(textFragment);
            })
            .then((documentFragment: DocumentFragment) => {
                this.validateFragment(
                    documentFragment
                )
                .then((childElement: HTMLElement | Element) => {
                    this.replaceCurlyBraces(childElement);
                    this.replaceInnerContent(childElement);
                })
                .then(() => {
                    this.parentElement.append(documentFragment);
                })
                .catch((error) => {
                    console.error(error);
                });
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }

    fetchFragment(url: string | URL): Promise<string>
    {
        return new Promise((resolve, reject) => {
            const xmlHttpRequest = new XMLHttpRequest();
            
            xmlHttpRequest.open("GET", url, false);

            xmlHttpRequest.onreadystatechange = () => {
                if (xmlHttpRequest.readyState === 4) {
                    if (xmlHttpRequest.status === 0 || xmlHttpRequest.status === 200) {
                        resolve(xmlHttpRequest.responseText);
                    }
                }
            }

            xmlHttpRequest.send(null);
        });
    }

    validateFragment(documentFragment: DocumentFragment): Promise<HTMLElement | Element>
    {
        return new Promise((resolve: (value: Element) => any, reject) => {
            if (documentFragment.firstElementChild === undefined) {
                throw "HTML fragments child cannot be undefined.";

            } else if (documentFragment.firstElementChild === null) {
                throw "HTML fragments child cannot be null.";

            } else if (!documentFragment.hasChildNodes()) {
                throw "Document fragments must have a child node.";

            } else if (documentFragment.childElementCount > 1) {
                throw "Document fragments must not have more than one child node.";

            } else if (documentFragment.firstElementChild.localName !== "html-fragment") {
                throw "Child HTML fragments must contain the no html-fragment";
            }

            resolve(documentFragment.firstElementChild);
        })
    }

    replaceCurlyBraces(childElement: HTMLElement | Element): void
    {
        const curlyBracesRegExp: RegExp = /\{\{(.*?)\}\}/gm;

        const dataset: [string, string | undefined][] = Object.entries(this.parentElement.dataset);

        dataset.map(([dataName, dataValue]) => {
            const targetElement = childElement.querySelector(`[data-${dataName}]`);

            if (targetElement === null) {
                throw `Data not found in fragment target element. Trying {{ ${dataName} }}`;

            } else {
                targetElement.outerHTML = targetElement.outerHTML.replace(curlyBracesRegExp, (match: string, value: string): string => { 
                    return eval(`(function() { return ${value}; })`).apply(this.parentElement);
                })
            }
        })
    }

    replaceInnerContent(childElement: HTMLElement | Element): void
    {
        const regExp: RegExp = /(\.\.\.children)/gm;

        const innerContent: string = this.parentElement.innerHTML;

        if (innerContent.trim() !== "") {
            this.parentElement.innerHTML = "";
            
            childElement.innerHTML = childElement.innerHTML.replace(regExp, innerContent);
        }
    }
}