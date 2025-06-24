'use client';

import { FormEvent, useState } from "react";

import "bootstrap-icons/font/bootstrap-icons.css";

import "./page.css";
import { VeincleLength } from "./Models/VeincleLength";
import { AxlesNumber } from "./Models/AxlesNumber";
import { VeincleSpeed } from "./Models/VeincleSpeed";

export default function Page() {
    function formDataToMap(formData) {
        const map = new Map();
        for (const [key, value] of formData.entries()) {
            map[key] = Number(value);
        }
        return map;
    }

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const url = 'http://localhost:7000/inference_instance';
        const formData = new FormData(event.currentTarget);
        const data = formDataToMap(formData);
        console.log(JSON.stringify(data));
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-type': 'application/json'}
        });
        const res = await response.json();
        console.log(res);
    }

    function getColor(percentage: number): string {
        // До 60 км/ч
        if (percentage < 18.0) return "rgb(0, 179, 0)";
        // От 60 до 80 км/ч
        else if (percentage >= 18 && percentage <= 41) return "rgb(204, 204, 0)";
        // От 80 до 110 км/ч
        else if (percentage > 41 && percentage < 76) return "rgb(255, 165, 0)";
        // Свыше 110 км/ч
        return "rgb(255, 0, 0)";
    }


    const veincleLength = new VeincleLength(155, 2330, 15, 450);
    const axlesNumber = new AxlesNumber(2, 9, 1, 2);
    const veincleSpeed = new VeincleSpeed(45, 130, 5, 50);
    const vehicleSpeedPercentage = veincleSpeed.calculatePercentage();

    return (
    <form onSubmit={onSubmit} autoComplete="on">
        <div className="mb-5">
            <div>
                <label htmlFor="veincle_length" className="form-label">
                    <p>Длина транспортного средства (от 155 до 2330 см):&nbsp;
                        <span className="text-primary fw-bold">
                            {veincleLength.currentValue}
                        </span>
                    </p>
                </label>
            </div>
            <div>
                <input id="veincle_length" type="range"
                        name="veincle length"
                        className="form-range"
                        min={veincleLength.minValue}
                        max={veincleLength.maxValue}
                        step={veincleLength.step}
                        value={veincleLength.currentValue}
                        onChange={(e) => veincleLength.setter(Number(e.target.value))}
                        required={true}
                />
            </div>
        </div>

        <div className="mb-5">
            <label htmlFor="veincle_weight"
                    className="form-label">Вес транспортного средства (от 44 до 57230 кг):
            </label>
            <input id="veincle_weight" type="number"
                    name="veincle weight"
                    min={44} max={57230}
                    className="form-control input_field"
                    required={true}
            />
        </div>

        <div className="mb-5">
            <div>
                <label htmlFor="axles_number" className="form-label">
                    <p>Количество осей (от 2 до 9 шт):&nbsp;
                        <span className="text-primary fw-bold">{axlesNumber.currentValue}</span>
                    </p>
                </label>
            </div>
            <div>
                <input id="axles_number" type="range"
                        name="axles number"
                        className="form-range"
                        min={axlesNumber.minValue}
                        max={axlesNumber.maxValue}
                        step={axlesNumber.step}
                        value={axlesNumber.currentValue}
                        onChange={(e) => axlesNumber.setter(Number(e.target.value))}
                        required={true}
                />
            </div>
        </div>

        <div className="mb-5">
            <label htmlFor="preceding_vehicle_time_gap" className="form-label">
                Временной интервал между транспортными средствами (от 3 до 1642 сек):
            </label>
            <input id="preceding_vehicle_time_gap" type="number"
                    name="preceding vehicle time-gap"
                    min={3} max={1642}
                    className="form-control input_field"
                    required={true}
            />
        </div>

        <div className="mb-5">
            <label htmlFor="Lane_of_the_road" className="form-label">
                Полоса движения (от 1 до 2 шт):
            </label>
            <input id="Lane_of_the_road" type="number"
                    name="Lane of the road"
                    min={1} max={2} step={1}
                    className="form-control input_field"
                    required={true}
            />
        </div>

        <div className="mb-5">
            <div>
                <label htmlFor="veincle_speed" className="form-label">
                    <p>Скорость транспортного средства (от 43,5 до 130,5 км/ч):&nbsp;
                        <span className="text-primary fw-bold">{veincleSpeed.currentValue}</span>
                    </p>
                </label>
            </div>
            <div>
                <input id="veincle_speed" type="range"
                        name="veincle speed"
                        className="slider"
                        min={veincleSpeed.minValue}
                        max={veincleSpeed.maxValue}
                        step={veincleSpeed.step}
                        value={veincleSpeed.currentValue}
                        style={{background: `linear-gradient(to right, ${getColor(vehicleSpeedPercentage)} 0%, ${getColor(vehicleSpeedPercentage)} ${vehicleSpeedPercentage}%, #dee2e6 ${vehicleSpeedPercentage}%, #dee2e6 100%)`}}
                        onChange={(e) => veincleSpeed.setter(Number(e.target.value))}
                        required={true}
                />
            </div>
        </div>

        <div className="mb-5">
            <label htmlFor="perceding_veincle_speed" className="form-label">
                Скорость предыдущего транспортного средства (от 42 до 119,5 км/ч):
            </label>
            <input id="perceding_veincle_speed" type="number"
                    name="perceding veincle speed"
                    min={42} max={119}
                    className="form-control input_field"
                    required={true}
            />
        </div>

        <div className="mb-5">
            <label htmlFor="perceding_veincle_weight" className="form-label">
                Вес предыдущего транспортного средства (от 366 до 33469 кг):
            </label>
            <input id="perceding_veincle_weight" type="number"
                    name="perceding veincle weight"
                    min={366} max={33469}
                    className="form-control input_field"
                    required={true}
            />
        </div>

        <div className="mb-5">
            <label htmlFor="perceding_veincle_length" className="form-label">
                Длина предыдущего транспортного средства (от 331 до 2139 см):
            </label>
            <input id="perceding_veincle_length" type="number"
                    name="perceding veincle length"
                    min={331} max={2139}
                    className="form-control input_field"
                    required={true}
            />
        </div>

        <fieldset className="mb-5">
            <legend>Состояние дороги:</legend>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <input
                    type="radio"
                    className="btn-check"
                    name="road_condition"
                    id="road_condition_0"
                    value={0}
                    autoComplete="off"
                    defaultChecked
                />
                <label className="btn btn-light image_input_radio" htmlFor="road_condition_0">
                    <i className="bi bi-sun"></i>
                    <span>Сухая</span>
                </label>

                <input
                    type="radio"
                    className="btn-check"
                    name="road_condition"
                    id="road_condition_2"
                    value={2}
                    autoComplete="off"
                />
                <label className="btn btn-light image_input_radio" htmlFor="road_condition_2">
                    <i className="bi bi-cloud-drizzle"></i>
                    <span>Влажная</span>
                </label>

                <input
                    type="radio"
                    className="btn-check"
                    name="road_condition"
                    id="road_condition_1"
                    value={1}
                    autoComplete="off"
                />
                <label className="btn btn-light image_input_radio" htmlFor="road_condition_1">
                    <i className="bi bi-cloud-rain"></i>
                    <span>Мокрая</span>
                </label>

                <input
                    type="radio"
                    className="btn-check"
                    name="road_condition"
                    id="road_condition_3"
                    value={3}
                    autoComplete="off"
                />
                <label className="btn btn-light image_input_radio" htmlFor="road_condition_3">
                    <i className="bi bi-cloud-snow"></i>
                    <span>Заснеженная</span>
                </label>
            </div>
        </fieldset>

        <div className="mb-5">
            <label htmlFor="Air_temprture" className="form-label">
                Температура воздуха (от -13 до 22 Цельсий):
            </label>
            <input id="Air_temprture" type="number"
                    name="Air temprture"
                    min={-13} max={22}
                    className="form-control input_field"
                    required={true}
            />
        </div>

        <fieldset className="mb-5">
            <legend>Погодные условия:</legend>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <input id="perception_type_0" type="radio"
                        name="perception type" value={0}
                        className="btn-check"
                        autoComplete="off"
                        defaultChecked
                />
                <label htmlFor="perception_type_0" className="btn btn-light image_input_radio">
                    <i className="bi bi-sun"></i>
                    <span>Ясно</span>
                </label>

                <input id="perception_type_1" type="radio"
                        name="perception type" value={1}
                        className="btn-check"
                        autoComplete="off"
                />
                <label htmlFor="perception_type_1" className="btn btn-light image_input_radio">
                    <i className="bi bi-cloud-rain"></i>
                    <span>Дождь</span>
                </label>

                <input id="perception_type_2" type="radio"
                        name="perception type" value={2}
                        className="btn-check"
                        autoComplete="off"
                />
                <label htmlFor="perception_type_2" className="btn btn-light image_input_radio">
                    <i className="bi bi-cloud-snow"></i>
                    <span>Снег</span>
                </label>
            </div>
        </fieldset>

        <fieldset className="mb-5">
            <legend>Количество осадков:</legend>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <input id="perception_intensity_-1" type="radio"
                        name="perception intensity" value={-1}
                        className="btn-check"
                        autoComplete="off"
                        defaultChecked
                />
                <label htmlFor="perception_intensity_-1" className="btn btn-light image_input_radio">
                    <i className="bi bi-sun"></i>
                    <span>Отсутствуют</span>
                </label>

                <input id="perception_intensity_0" type="radio"
                        name="perception intensity" value={0}
                        className="btn-check"
                        autoComplete="off"
                />
                <label htmlFor="perception_intensity_0" className="btn btn-light image_input_radio">
                    <i className="bi bi-droplet"></i>
                    <span>Незначительные</span>
                    <span>(0-6 мм/ч)</span>
                </label>

                <input id="perception_intensity_1" type="radio"
                        name="perception intensity" value={1}
                        className="btn-check"
                        autoComplete="off"
                />
                <label htmlFor="perception_intensity_1" className="btn btn-light image_input_radio">
                    <i className="bi bi-cloud-drizzle"></i>
                    <span>Умеренные</span>
                    <span>(6-30 мм/ч)</span>
                </label>

                <input id="perception_intensity_2" type="radio"
                        name="perception intensity" value={2}
                        className="btn-check"
                        autoComplete="off"
                />
                <label htmlFor="perception_intensity_2" className="btn btn-light image_input_radio">
                    <i className="bi bi-cloud-rain"></i>
                    <span>Значительные</span>
                    <span>(более 30 мм/ч)</span>
                </label>
            </div>

            {/* <input id="perception_intensity" type="radio" name="perception intensity" value={3} />
            <label htmlFor="perception_intensity"></label> */}
        </fieldset>

        <div className="mb-5">
            <label htmlFor="relatve_humadity" className="form-label">
                Относительная влажность воздуха (от 16 до 97%):
            </label>
            <input id="relatve_humadity" type="number"
                    name="relatve humadity"
                    min={16} max={97}
                    className="form-control input_field"
                    required={true}
            />
        </div>

        <div className="mb-5">
            <label htmlFor="wind_direction" className="form-label">
                Направление ветра (от 6 до 360 см):
            </label>
            <input id="wind_direction" type="number"
                    name="wind direction"
                    min={6} max={360}
                    className="form-control input_field"
                    required={true}
            />
        </div>

        <div className="mb-5">
            <label htmlFor="wind_speed" className="form-label">
                Скорость ветра (от 0 до 15 м/с):
            </label>
            <input id="wind_speed" type="number"
                    name="wind speed"
                    min={0} max={15}
                    className="form-control input_field"
                    required={true}
            />
        </div>

        <fieldset className="mb-5">
            <legend>Условия освещения:</legend>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <input id="Lighting_condition_0" type="radio"
                        name="Lighting condition" value={0}
                        className="btn-check"
                        autoComplete="off"
                        defaultChecked
                />
                <label htmlFor="Lighting_condition_0" className="btn btn-light image_input_radio">
                    <i className="bi bi-brightness-high"></i>
                    <span>День</span>
                </label>

                <input id="Lighting_condition_1" type="radio"
                        name="Lighting condition" value={1}
                        className="btn-check"
                        autoComplete="off"
                />
                <label htmlFor="Lighting_condition_1" className="btn btn-light image_input_radio">
                    <i className="bi bi-moon"></i>
                    <span>Ночь</span>
                </label>

                <input id="Lighting_condition_2" type="radio"
                        name="Lighting condition" value={2}
                        className="btn-check"
                        autoComplete="off"
                />
                <label htmlFor="Lighting_condition_2" className="btn btn-light image_input_radio">
                    <i className="bi bi-cloud-moon"></i>
                    <span>Сумерки</span>
                </label>
            </div>
        </fieldset>
        
        <div className="mb-5 d-flex justify-content-center">
            <button className="btn btn-primary btn-lg" type="submit">Отправить</button>
        </div>
    </form>
    );
}