import { CustomElement } from "./custom-element";

export { Session };

class Session
{
    mode: "development" | "production" = "development";
    customElements: object = new CustomElement("pvt-new");
}