'use client';

import { FormEvent, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./page.css";

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

    function getColor(value) {
        if (value <= 60) return '#28a745';       // зеленый
        if (value <= 90) return '#ffc107';       // желтый
        if (value <= 110) return '#fd7e14';      // оранжевый
        return '#dc3545';                        // красный
    }

    const [veincleLengthValue, veincleLengthSetter] = useState(450);
    const [axlesNumberValue, axlesNumberSetter] = useState(2);
    const [veincleSpeedValue, veincleSpeedSetter] = useState(50);

    return (
    <form onSubmit={onSubmit} autoComplete="on" style={{ width: "80%" }}>
        <div className="mb-3">
            <label htmlFor="veincle_length" className="form-label">
                <span>Длина транспортного средства (от 155 до 2330 см): </span>
                <span className="text-primary fw-bold">{veincleLengthValue}</span>
                </label>
            <input id="veincle_length" type="range" className="form-range"
            min={155} max={2330} step={15} value={veincleLengthValue}
            onChange={(e) => veincleLengthSetter(Number(e.target.value))} required={true} />
        </div>

        <div className="mb-3">
            <label htmlFor="veincle_weight" className="form-label">Вес транспортного средства (от 44 до 57230 кг):</label>
            <input id="veincle_weight" type="number" name="veincle weight" min={44} max={57230} className="form-control" required={true} />
        </div>

        <div className="mb-3">
            <label htmlFor="axles_number" className="form-label">
                <span>Количество осей (от 2 до 9): </span>
                <span className="text-primary fw-bold">{axlesNumberValue}</span>
            </label>
            <input id="axles_number" type="range" className="form-range"
            min={2} max={9} step={1} value={axlesNumberValue}
            onChange={(e) => axlesNumberSetter(Number(e.target.value))} required={true} />
        </div>

        <div className="mb-3">
            <label htmlFor="preceding_vehicle_time_gap" className="form-label">Предыдущий временной промежуток между транспортными средствами (от 3 до 1642 сек):</label>
            <input id="preceding_vehicle_time_gap" type="number" name="preceding vehicle time-gap" min={3} max={1642} className="form-control" required={true} />
        </div>

        <div className="mb-3">
            <label htmlFor="Lane_of_the_road" className="form-label">Полоса движения (от 1 до 2):</label>
            <input id="Lane_of_the_road" type="number" name="Lane of the road" min={1} max={2} className="form-control" required={true} />
        </div>

        <div className="mb-3">
            <label htmlFor="veincle_speed" className="form-label">
                <span>Скорость транспортного средства (от 43,5 до 130,5 км/ч): </span>
                <span className="text-primary fw-bold">{veincleSpeedValue}</span>
            </label>
            {/* <input id="veincle_speed" type="number" name="veincle speed" min={44} max={130} className="form-control" required={true} /> */}
            <input id="veincle_speed" type="range" className="form-range"
            min={45} max={130} step={5} value={veincleSpeedValue}
            onChange={(e) => veincleSpeedSetter(Number(e.target.value))} required={true}/>
        </div>

        <div className="mb-3">
            <label htmlFor="perceding_veincle_speed" className="form-label">Скорость предыдущего транспортного средства (от 42 до 119,5 км/ч):</label>
            <input id="perceding_veincle_speed" type="number" name="perceding veincle speed" min={42} max={119} className="form-control" required={true} />
        </div>

        <div className="mb-3">
            <label htmlFor="perceding_veincle_weight" className="form-label">Вес предыдущего транспортного средства (от 366 до 33469 кг):</label>
            <input id="perceding_veincle_weight" type="number" name="perceding veincle weight" min={366} max={33469} className="form-control" required={true} />
        </div>

        <div className="mb-3">
            <label htmlFor="perceding_veincle_length" className="form-label">Длина предыдущего транспортного средства (от 331 до 2139 см):</label>
            <input id="perceding_veincle_length" type="number" name="perceding veincle length" min={331} max={2139} className="form-control" required={true} />
        </div>

        <fieldset>
            <legend>Состояние дороги:</legend>
            <div className="form-check">
                <input id="road_condition" type="radio" name="road condition" value={0} className="form-check-input" defaultChecked={true} />
                <label htmlFor="road_condition" className="form-check-label">Сухая</label>
            </div>

            <div className="form-check">
                <input id="road_condition" type="radio" name="road condition" value={2} className="form-check-input" />
                <label htmlFor="road_condition" className="form-check-label">Влажная</label>
            </div>

            <div className="form-check">
                <input id="road_condition" type="radio" name="road condition" value={1} className="form-check-input" />
                <label htmlFor="road_condition" className="form-check-label">Мокрая</label>
            </div>

            <div className="form-check">
                <input id="road_condition" type="radio" name="road condition" value={3} className="form-check-input" />
                <label htmlFor="road_condition" className="form-check-label">Заснеженная</label>
            </div>
        </fieldset>

        <div className="mb-3">
            <label htmlFor="Air_temprture" className="form-label">Температура воздуха (от -13 до 22 Цельсий):</label>
            <input id="Air_temprture" type="number" name="Air temprture" min={-13} max={22} className="form-control" required={true} />
        </div>

        <fieldset>
            <legend>Погодные условия:</legend>

            <div className="form-check">
                <input id="perception_type" type="radio" name="perception type" value={0} className="form-check-input" defaultChecked={true} />
                <label htmlFor="perception_type" className="form-check-label">Ясно</label>
            </div>

            <div className="form-check">
                <input id="perception_type" type="radio" name="perception type" value={1} className="form-check-input" />
                <label htmlFor="perception_type" className="form-check-label">Дождь</label>
            </div>

            <div className="form-check">
                <input id="perception_type" type="radio" name="perception type" value={2} className="form-check-input" />
                <label htmlFor="perception_type" className="form-check-label">Снег</label>
            </div>
        </fieldset>

        <fieldset>
            <legend>Количество осадков:</legend>

            <div className="form-check">
                <input id="perception_intensity" type="radio" name="perception intensity" value={-1} className="form-check-input" defaultChecked={true} />
                <label htmlFor="perception_intensity" className="form-check-label">Отсутствуют</label>
            </div>

            <div className="form-check">
                <input id="perception_intensity" type="radio" name="perception intensity" value={0} className="form-check-input" />
                <label htmlFor="perception_intensity" className="form-check-label">Незначительные (0-6 мм/ч)</label>
            </div>

            <div className="form-check">
                <input id="perception_intensity" type="radio" name="perception intensity" value={1} className="form-check-input" />
                <label htmlFor="perception_intensity" className="form-check-label">Умеренные (6-30 мм/ч)</label>
            </div>

            <div className="form-check">
                <input id="perception_intensity" type="radio" name="perception intensity" value={2} className="form-check-input" />
                <label htmlFor="perception_intensity" className="form-check-label">Значительне (свыше 30 мм/ч)</label>
            </div>

            {/* <input id="perception_intensity" type="radio" name="perception intensity" value={3} />
            <label htmlFor="perception_intensity"></label> */}
        </fieldset>

        <div className="mb-3">
            <label htmlFor="relatve_humadity" className="form-label">Относительная влажность воздуха (от 16 до 97%):</label>
            <input id="relatve_humadity" type="number" name="relatve humadity" min={16} max={97} className="form-control" required={true} />
        </div>

        <div className="mb-3">
            <label htmlFor="wind_direction" className="form-label">Направление ветра (от 6 до 360 см):</label>
            <input id="wind_direction" type="number" name="wind direction" min={6} max={360} className="form-control" required={true} />
        </div>

        <div className="mb-3">
            <label htmlFor="wind_speed" className="form-label">Скорость ветра (от 0 до 15 м/с):</label>
            <input id="wind_speed" type="number" name="wind speed" min={0} max={15} className="form-control" required={true} />
        </div>

        <fieldset>
            <legend>Условия освещения:</legend>

            <div className="form-check">
                <input id="Lighting_condition" type="radio" name="Lighting condition" value={0} className="form-check-input" defaultChecked={true} />
                <label htmlFor="Lighting_condition" className="form-check-label">День</label>
            </div>

            <div className="form-check">
                <input id="Lighting_condition" type="radio" name="Lighting condition" value={1} className="form-check-input" />
                <label htmlFor="Lighting_condition" className="form-check-label">Ночь</label>
            </div>

            <div className="form-check">
                <input id="Lighting_condition" type="radio" name="Lighting condition" value={2} className="form-check-input" />
                <label htmlFor="Lighting_condition" className="form-check-label">Сумерки</label>
            </div>
        </fieldset>
        
        <div className="col-12">
            <button className="btn btn-primary" type="submit">Отправить</button>
        </div>
    </form>
    );
}