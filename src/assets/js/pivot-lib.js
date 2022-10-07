"use strict";
new class Writer extends PivotCore.Pivot {
    constructor() {
        super();
        this.data = {
            message: "Lorem Ipsum",
            interval: 50,
            timeout: 0,
            onloadclass: "",
            statement: ""
        };
        this.init(this.data);
    }
    whenDefined() {
        const pivot = this.pivot;
        const message = this.data.message;
        const interval = parseInt(this.data.interval.toString());
        const timeout = parseInt(this.data.timeout.toString());
        const onloadclass = this.data.onloadclass;
        const pivotInnerHTMLBackup = pivot.innerHTML;
        onViewport(pivot).then(() => {
            if (!isNull(timeout)) {
                setTimeout(() => { startTyping(); }, timeout);
            }
            else {
                startTyping();
            }
        });
        function startTyping() {
            if (!isNull(onloadclass)) {
                pivot.classList.add(onloadclass);
            }
            pivot.innerHTML = "";
            setCounter((newValue) => {
                if (message[newValue] !== undefined) {
                    pivot.innerHTML += message[newValue];
                }
            }, 0, message.length, interval).then(() => {
                pivot.innerHTML += pivotInnerHTMLBackup;
            });
        }
    }
};
