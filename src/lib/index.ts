import { Pivot } from "../core/index";
import { ElementTriggler } from "../core/instance/element-trigger";

class Messager extends ElementTriggler
{
    constructor()
    {
        super();
    }
    data() {
        return {
            message: "!"
        }
    }
    whenDefined(element?: HTMLElement | undefined, data?: any): void {
        /** Do somthing */
    }
}

Pivot.Use([Messager])