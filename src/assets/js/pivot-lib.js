"use strict";
new class Writer extends Pivot {
    constructor() {
        super({
            template: "writer",
            dataset: {
                message: "placeholder",
                interval: 50,
                timeout: 0,
                onloadclass: ""
            }
        });
    }
    whenDefined(occur) {
        if (this.args === undefined)
            return;
        restrictTo(this.args.dataset.message, "string", true);
        restrictTo(parseInt(this.args.dataset.interval), "number", true);
        restrictTo(parseInt(this.args.dataset.timeout), "number");
        restrictTo(this.args.dataset.onloadclass, "string");
        let message = this.args.dataset.message;
        let interval = parseInt(this.args.dataset.interval);
        let timeout = parseInt(this.args.dataset.timeout);
        let onloadclass = this.args.dataset.onloadclass;
        let alreadyInitialized = false;
        init();
        window.addEventListener("scroll", () => { init(); }, true);
        function init() {
            if (!alreadyInitialized && inViewport(occur)) {
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
                occur.classList.add(onloadclass);
            setCounter((newValue) => {
                if (message[newValue] !== undefined) {
                    occur.innerHTML += message[newValue];
                }
            }, 0, message.length, interval);
        }
    }
};
