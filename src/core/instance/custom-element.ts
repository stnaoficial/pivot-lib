export { CustomElement };

class CustomElement
{
    occurs?: [object][];

    constructor(tagName: string)
    {
        const occurs: [object][] = [];

        customElements.define(
            tagName,
            class extends HTMLElement
            {
                constructor()
                {
                    super();
                }

                connectedCallback()
                {
                    if (typeof this === "object") {
                        occurs.push(this);
                    }
                }
            }
        )

        this.occurs = occurs;
    }
}
