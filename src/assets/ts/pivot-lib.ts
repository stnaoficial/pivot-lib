new class Writer extends Pivot {
    constructor() {
        super();
        this.setArgument("template", "writer");
        this.setArgument("dataset", { message: "Hello World!" });
    }
}