"use strict";
new class Writer extends Pivot {
    constructor() {
        super();
        this.data = {
            message: "Lorem Ipsum",
            interval: 50,
            timeout: 0,
            onloadclass: ""
        };
        this.init(this.data);
    }
    whenDefined(target) {
        let message = this.data.message;
        let interval = parseInt(this.data.interval.toString());
        let timeout = parseInt(this.data.timeout.toString());
        let onloadclass = this.data.onloadclass;
        let alreadyInitialized = false;
        init();
        window.addEventListener("scroll", () => { init(); }, true);
        function init() {
            if (!alreadyInitialized && inViewport(target)) {
                alreadyInitialized = true;
                if (!isNull(timeout)) {
                    setTimeout(() => { startTyping(); }, timeout);
                }
                else {
                    startTyping();
                }
            }
        }
        function startTyping() {
            if (!isNull(onloadclass))
                target.classList.add(onloadclass);
            setCounter((newValue) => {
                if (message[newValue] !== undefined) {
                    target.innerHTML += message[newValue];
                }
            }, 0, message.length, interval);
        }
    }
};
