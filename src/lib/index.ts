import { PivotCore } from "../core/index";

new class Messager extends PivotCore.Controller
{
    constructor()
    {
        super();
    }
    data(): object
    {
        return {
            title: "dadsdas",
            message: "aeee"
        }
    }
    whenDefined(self: HTMLElement, data: object)
    {
        console.log(self, data);
    }
}

new class XML extends PivotCore.Controller
{
    constructor()
    {
        super();
    }
    whenDefined(self: HTMLElement, data: object)
    {
        console.log(self, data);
    }
}