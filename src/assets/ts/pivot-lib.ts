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
    whenDefined(occur: HTMLElement): void {
        if (this.args === undefined) return;

        restrictTo(this.args.dataset.message, "string", true)
        restrictTo(parseInt(this.args.dataset.interval), "number", true)
        restrictTo(parseInt(this.args.dataset.timeout), "number")
        
        let message = this.args.dataset.message;
        let interval = parseInt(this.args.dataset.interval);
        let timeout = parseInt(this.args.dataset.timeout);
        let alreadyInitialized = false;

        occur.style.display = "none";

        init();

        window.addEventListener("scroll", (evt) => { init(); }, true);

        function init(): void {
            if (!alreadyInitialized && inViewport(occur)) {
                alreadyInitialized = true;
                if (!isNull(timeout)) {
                    setTimeout(() => { startTyping(); }, timeout);
                } else {
                    startTyping();
                }
            }
        }

        function startTyping(): void {
            occur.style.display = "block";
            setCounter((newValue) => {
                if (message[newValue as keyof (typeof message)] !== undefined) {
                    occur.innerHTML += message[newValue as keyof (typeof message)];
                }
            }, 0, message.length, interval);
        }
    }
}