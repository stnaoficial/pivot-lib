import { PivotCore } from "../core/index";
import { isNull, onViewport, setCounter } from "../utils/index";

new class Empty extends PivotCore.Pivot {}

new class Writer extends PivotCore.Pivot
{
    public data(): PivotTypes.PivotData
    {
        return {
            message: "Lorem Ipsum",
            interval: 50,
            timeout: 0,
            onloadclass: "",
            statement: ""
        }
    }

    public whenDefined(element: HTMLElement, data: PivotTypes.PivotData): void
    {
        const message     = data.message;
        const interval    = parseInt(data.interval.toString());
        const timeout     = parseInt(data.timeout.toString());
        const onloadclass = data.onloadclass;

        const elementInnerHTMLBackup = element.innerHTML;

        onViewport(element).then(() => {
            if (!isNull(timeout)) {
                setTimeout(() => { startTyping(); }, timeout);
            } else {
                startTyping();
            }
        })
        
        function startTyping(): void {
            if (!isNull(onloadclass)) {
                element.classList.add(onloadclass);
            }

            element.innerHTML = "";

            setCounter((newValue) => {
                if (message[newValue as keyof (typeof message)] !== undefined) {
                    element.innerHTML += message[newValue as keyof (typeof message)];
                }

            }, 0, message.length, interval).then(() => {
                element.innerHTML += elementInnerHTMLBackup;
            });
        }
    }
}