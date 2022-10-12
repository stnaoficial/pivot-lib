import { PivotCore } from "../core/pivot-core";
import { isNull, onViewport, setCounter } from "../utils/pivot-utils";

interface WriterData {
    message: string;
    interval: number;
    timeout: number;
    onloadclass: string;
    statement: string;
}
new class Writer extends PivotCore.Pivot{
    data: WriterData;
    public constructor() {
        super();

        this.data = {
            message: "Lorem Ipsum",
            interval: 50,
            timeout: 0,
            onloadclass: "",
            statement: ""
        }

        this.defineDefaultData(this.data);
    }
    public whenDefined(element: HTMLElement): void {
        const message = this.data.message;
        const interval = parseInt(this.data.interval.toString());
        const timeout = parseInt(this.data.timeout.toString());
        const onloadclass = this.data.onloadclass;

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