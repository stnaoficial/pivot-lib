interface WriterData {
    message: string;
    interval: number;
    timeout: number;
    onloadclass: string;
    statement: string;
}
new class Writer extends PivotCore.Pivot{
    data: WriterData;
    pivot!: HTMLElement;
    public constructor() {
        super();

        this.data = {
            message: "Lorem Ipsum",
            interval: 50,
            timeout: 0,
            onloadclass: "",
            statement: ""
        }

        this.init(this.data);
    }
    public whenDefined(): void {
        const pivot = this.pivot;

        const message     = this.data.message;
        const interval    = parseInt(this.data.interval.toString());
        const timeout     = parseInt(this.data.timeout.toString());
        const onloadclass = this.data.onloadclass;

        const pivotInnerHTMLBackup = pivot.innerHTML;

        onViewport(pivot).then(() => {
            if (!isNull(timeout)) {
                setTimeout(() => { startTyping(); }, timeout);
            } else {
                startTyping();
            }
        })
        
        function startTyping(): void {
            if (!isNull(onloadclass)) {
                pivot.classList.add(onloadclass);
            }

            pivot.innerHTML = "";

            setCounter((newValue) => {
                if (message[newValue as keyof (typeof message)] !== undefined) {
                    pivot.innerHTML += message[newValue as keyof (typeof message)];
                }

            }, 0, message.length, interval).then(() => {
                pivot.innerHTML += pivotInnerHTMLBackup;
            });
        }
    }
}