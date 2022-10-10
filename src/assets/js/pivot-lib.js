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
        this.defineDefaultData(this.data);
    }
    whenDefined(element) {
        const message = this.data.message;
        const interval = parseInt(this.data.interval.toString());
        const timeout = parseInt(this.data.timeout.toString());
        const onloadclass = this.data.onloadclass;
        const elementInnerHTMLBackup = element.innerHTML;
        onViewport(element).then(() => {
            if (!isNull(timeout)) {
                setTimeout(() => { startTyping(); }, timeout);
            }
            else {
                startTyping();
            }
        });
        function startTyping() {
            if (!isNull(onloadclass)) {
                element.classList.add(onloadclass);
            }
            element.innerHTML = "";
            setCounter((newValue) => {
                if (message[newValue] !== undefined) {
                    element.innerHTML += message[newValue];
                }
            }, 0, message.length, interval).then(() => {
                element.innerHTML += elementInnerHTMLBackup;
            });
        }
    }
};
