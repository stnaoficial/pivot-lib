new Pivot({
    template: "banner",
    attrs: {
        interval: 1000
    },
    funcs: {
        init() {
            console.log(this)
        }
    }
});