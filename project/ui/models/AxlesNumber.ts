import { Dispatch, SetStateAction, useState } from "react";
import {InputParameter} from "./InputParameter";

export class AxlesNumber extends InputParameter {
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
}