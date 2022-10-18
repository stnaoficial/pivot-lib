// import { PivotCore } from "../core/pivot-core";
// import { isNull, onViewport, setCounter } from "../utils/index";

// new class Writer extends PivotCore.Template
// {
//     public data(): any
//     {
//         return {
//             message: "Lorem Ipsum",
//             interval: 50,
//             timeout: 0,
//             onloadclass: "",
//             statement: ""
//         }
//     }

//     public whenDefined(element: HTMLElement, data: any): void
//     {        
//         const output = element.querySelector("[data-message]") || new HTMLElement;

//         const outputInnerHTMLBackup = output.innerHTML;

//         onViewport(element).then(() => {
//             if (!isNull(parseInt(data.timeout))) {
//                 setTimeout(() => { startTyping(); }, parseInt(data.timeout));
//             } else {
//                 startTyping();
//             }
//         })
        
//         function startTyping(): void {
//             if (!isNull(data.onloadclass)) {
//                 element.classList.add(data.onloadclass);
//             }

//             output.innerHTML = "";

//             setCounter((newValue) => {
//                 if (data.message[newValue as keyof (typeof data.message)] !== undefined) {
//                     output.innerHTML += data.message[newValue as keyof (typeof data.message)];
//                 }

//             }, 0, data.message.length, parseInt(data.interval.toString())).then(() => {
//                 output.innerHTML += outputInnerHTMLBackup;
//             });
//         }

//         return data;
//     }
// }