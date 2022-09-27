new class Writer extends Pivot {
    constructor() {
        super();

        this.args = {};
        this.args.template = "writer";
        this.args.dataset = { message: "Hello World!" };
    }
}