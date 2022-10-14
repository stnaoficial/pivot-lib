declare namespace PivotTypes
{
    type PivotData = object | any;

    interface Pivot {
        data(): PivotTypes.PivotData;
        dataWillBeDefined<T extends PivotData>(data: T): T;
        whenDefined(element?: HTMLElement, data?: PivotTypes.PivotData): void;
    }
}