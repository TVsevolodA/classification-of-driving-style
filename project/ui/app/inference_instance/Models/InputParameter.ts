export abstract class InputParameter {
    abstract minValue: number;
    abstract maxValue: number;
    abstract step: number;
    abstract currentValue: number;
}