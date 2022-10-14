declare namespace PivotTypes
{
    type PivotData = object;

    interface Pivot {
        defineDefaultData(data: PivotData): void;
        dataWillBeDefined<T extends PivotData>(data: T): T;
        whenDefined(element?: HTMLElement): void;
    }
}