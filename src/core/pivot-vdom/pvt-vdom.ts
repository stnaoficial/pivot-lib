export namespace PivotVDOM
{
    class VDOMHandler
    {
        static HasChildren(HTMLTextStructure: string): RegExpMatchArray | null
        {
            return HTMLTextStructure.match(/\[(.*?)\]/g);
        }

        static AppendChildren(HTMLTextStructure: string, HTMLInnerStructure: string): string
        {
            return HTMLTextStructure.replace(/\[(.*?)\]/g, HTMLInnerStructure);
        }

        static HasData(HTMLTextStructure: string): RegExpMatchArray | null
        {
            return HTMLTextStructure.match(/\{\{(.*?)\}\}/g);
        }

        static CollateData(HTMLTextStructure: string, DOMStringMap: DOMStringMap): string
        {
            return HTMLTextStructure.replace(
                /\{\{(.*?)\}\}/g, 
                (match: string, value: string): string => {
                    return DOMStringMap[value.trim()] ?? value.trim();
                }
            );
        }
    }

    export class VDOM extends VDOMHandler
    {
        body: [any][];

        constructor()
        {
            super();

            this.body = [];
        }
    }
}
