import { Dispatch, SetStateAction, useState } from "react";
import {InputParameter} from "./InputParameter";

export class VeincleSpeed extends InputParameter {
    minValue: number;
    maxValue: number;
    step: number;
    currentValue: number;
    setter: Dispatch<SetStateAction<number>>;

    
    constructor(minValue, maxValue, step, currentValue) {
        super();
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.step = step;
        [this.currentValue, this.setter] = useState(currentValue);
    }

    calculatePercentage(): number {
        return (this.currentValue - this.minValue) / (this.maxValue - this.minValue) * 100;
    }
}