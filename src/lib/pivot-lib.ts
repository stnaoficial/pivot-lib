import { PivotCore } from "../core/pivot-core";

new class Messager extends PivotCore.Pivot
{
    constructor()
    {
        super();
    }
    data(): object
    {
        return {}
    }
    whenDefined(occur: HTMLElement, data: any)
    {
        console.log(occur, data);
    }
}