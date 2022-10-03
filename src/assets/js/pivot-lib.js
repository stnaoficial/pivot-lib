"use strict";
new class Console extends Pivot {
    constructor() {
        super({
            template: "console",
            dataset: {
                message: "placeholder",
                interval: 50,
                timeout: 0
            }
        });
    }
    whenDefined(occur) {
        if (this.args === undefined)
            return;
        restrictTo(this.args.dataset.message, "string", true);
        restrictTo(parseInt(this.args.dataset.interval), "number", true);
        restrictTo(parseInt(this.args.dataset.timeout), "number");
        let message = this.args.dataset.message;
        let interval = parseInt(this.args.dataset.interval);
        let timeout = parseInt(this.args.dataset.timeout);
        let alreadyInitialized = false;
        occur.style.display = "none";
        init();
        window.addEventListener("scroll", (evt) => { init(); }, true);
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
            occur.style.display = "block";
            setCounter((newValue) => {
                if (message[newValue] !== undefined) {
                    occur.innerHTML += message[newValue];
                }
            }, 0, message.length, interval);
        }
    }
};
