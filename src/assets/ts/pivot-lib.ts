interface WriterData {
    message: string;
    interval: number;
    timeout: number;
    onloadclass: string;
}
new class Writer extends PivotCore.Pivot{
    data: WriterData;
    public constructor() {
        super();

        this.data = {
            message: "Lorem Ipsum",
            interval: 50,
            timeout: 0,
            onloadclass: ""
        }

        this.init(this.data);
    }
    public whenDefined(target: HTMLElement): void {
        let message     = this.data.message;
        let interval    = parseInt(this.data.interval.toString());
        let timeout     = parseInt(this.data.timeout.toString());
        let onloadclass = this.data.onloadclass;

        let oldTargetInnerHTML = target.innerHTML;
                
        inViewport(target).then(() => {
            if (!isNull(timeout)) {
                setTimeout(() => { startTyping(); }, timeout);
            } else {
                startTyping();
            }
        })
        
        function startTyping(): void {
            if (!isNull(onloadclass)) {
                target.classList.add(onloadclass);
            }

            target.innerHTML = "";

            setCounter((newValue) => {
                if (message[newValue as keyof (typeof message)] !== undefined) {
                    target.innerHTML += message[newValue as keyof (typeof message)];
                }

            }, 0, message.length, interval).then(() => {
                target.innerHTML += oldTargetInnerHTML;
            });
        }
    }
}