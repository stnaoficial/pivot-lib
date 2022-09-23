new Pivot({
    template: "banner",
    attrs: {},
    funcs: {
        init() {
            
        }
    }
})

new Pivot({
    template: "card",
    attrs: {},
    funcs: {
        init() {
            
        }
    }
})
new class Test extends Pivot {
    constructor() {
        super();

        this.applyHandlers({
            template: "test",
            attrs: {},
            funcs: {
                init() {
                    
                }
            }
        });
    }

    handlerWillBeApplied(handler: PivotHandler) {
        console.log(handler)
    }
}