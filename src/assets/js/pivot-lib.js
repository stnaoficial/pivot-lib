"use strict";
new Pivot({
    template: "writer",
    data: {
        message: "default",
        interval: 1000
    },
    handler: {
        init() {
            // console.log(this);
        }
    }
});
// new class Writer extends Pivot {
//     constructor() {
//         super({
//             template: "writer",
//             dataset: {
//                 message: String,
//                 interval: Number
//             }
//         });
//     }
// }
