'use client';
import { FormEvent, useState } from "react";
import "./page.css";
import Modal from "./modal_result_window"
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
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-type': 'application/json'},
            credentials: 'include',
        });
        const res = await response.json();
        setPredict(res);
        setIsOpen(true);
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
    const percedingVeincleLength = new VeincleLength(331, 2139, 15, 450);
    const axlesNumber = new AxlesNumber(2, 9, 1, 2);

    const veincleSpeed = new VeincleSpeed(45, 130, 1, 50);
    const vehicleSpeedPercentage = veincleSpeed.calculatePercentage();

    const percedingVeincleSpeed = new VeincleSpeed(42, 119, 1, 50);
    const percedingVeincleSpeedPercentage = percedingVeincleSpeed.calculatePercentage();

    const [isOpen, setIsOpen] = useState(false);
    const [predict, setPredict] = useState({});

    return (
    <div className="min-vh-100" style={{ background: "linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)" }}>
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                    {/* Заголовок */}
                    <div className="text-center mb-5">
                        <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                            <i className="bi bi-cpu-fill text-primary" style={{ fontSize: "2rem" }}></i>
                            <h1 className="display-5 fw-bold text-dark mb-0">Анализ стиля вождения</h1>
                        </div>
                        <p className="lead text-muted mx-auto" style={{ maxWidth: "600px" }}>
                            Введите данные о вашем автомобиле, скорости движения и погодных условиях для предсказания стиля вождения
                            с помощью нейросети
                        </p>
                    </div>

                    <form onSubmit={onSubmit} autoComplete="on">
                        {/* Данные о скорости */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-success bg-opacity-10 border-success border-opacity-25">
                            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                                <i className="bi bi-speedometer2 text-success"></i>
                                Данные о скорости
                            </h5>
                            <small className="text-muted">Введите информацию о скоростных характеристиках поездки</small>
                            </div>

                            <div className="card-body">
                                <label htmlFor="veincle_speed" className="form-label">
                                    Скорость транспортного средства: {veincleSpeed.currentValue} км/ч
                                </label>
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

                            <div className="card-body">
                                <label htmlFor="perceding_veincle_speed" className="form-label">
                                    Скорость предыдущего транспортного средства: {percedingVeincleSpeed.currentValue} км/ч
                                </label>
                                <input id="perceding_veincle_speed" type="range"
                                        name="perceding veincle speed"
                                        className="slider"
                                        min={percedingVeincleSpeed.minValue}
                                        max={percedingVeincleSpeed.maxValue}
                                        step={percedingVeincleSpeed.step}
                                        value={percedingVeincleSpeed.currentValue}
                                        style={{background: `linear-gradient(to right, ${getColor(percedingVeincleSpeedPercentage)} 0%, ${getColor(percedingVeincleSpeedPercentage)} ${percedingVeincleSpeedPercentage}%, #dee2e6 ${percedingVeincleSpeedPercentage}%, #dee2e6 100%)`}}
                                        onChange={(e) => percedingVeincleSpeed.setter(Number(e.target.value))}
                                        required={true}
                                />
                            </div>
                        </div>

                        {/* Данные об автомобилях  */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-success bg-opacity-10 border-success border-opacity-25">
                            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                                <i className="bi bi-car-front text-primary"></i>
                                Данные об автомобилях
                            </h5>
                            <small className="text-muted">Укажите характеристики вашего транспортного средства</small>
                            </div>

                            <div className="card-body">
                                <label htmlFor="axles_number" className="form-label">
                                    Количество осей: {axlesNumber.currentValue} шт
                                </label>
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

                            <div className="card-body">
                                <label htmlFor="currentSpeed" className="form-label">
                                    Длина транспортного средства:&nbsp;{veincleLength.currentValue} см
                                </label>
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

                            <div className="card-body">
                                <label htmlFor="perceding_veincle_length" className="form-label">
                                    Длина предыдущего транспортного средства {percedingVeincleLength.currentValue} см:
                                </label>
                                <input id="perceding_veincle_length" type="range"
                                        name="perceding veincle length"
                                        min={percedingVeincleLength.minValue}
                                        max={percedingVeincleLength.maxValue}
                                        step={percedingVeincleLength.step}
                                        value={percedingVeincleLength.currentValue}
                                        onChange={(e) => percedingVeincleLength.setter(Number(e.target.value))}
                                        className="form-range"
                                        required={true}
                                />
                            </div>

                            <div className="card-body">
                                <label htmlFor="veincle_weight" className="form-label">
                                    Вес транспортного средства (кг):
                                </label>
                                <input id="veincle_weight" type="number"
                                        name="veincle weight"
                                        min={44} max={57230}
                                        className="form-control input_field"
                                        required={true}
                                />
                            </div>

                            <div className="card-body">
                                <label htmlFor="perceding_veincle_weight" className="form-label">
                                    Вес предыдущего транспортного средства (кг):
                                </label>
                                <input id="perceding_veincle_weight" type="number"
                                        name="perceding veincle weight"
                                        min={366} max={33469}
                                        className="form-control input_field"
                                        required={true}
                                />
                            </div>
                        </div>

                        {/* Погодные данные */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-success bg-opacity-10 border-success border-opacity-25">
                                <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                                    <i className="bi bi-cloud-rain text-info"></i>
                                    Погодные условия
                                </h5>
                                <small className="text-muted">Укажите текущие погодные условия и состояние дороги</small>
                            </div>

                            <div className="card-body">
                                <label htmlFor="Air_temprture" className="form-label">
                                    Температура воздуха (°C):
                                </label>
                                <input id="Air_temprture" type="number"
                                        name="Air temprture"
                                        min={-13} max={22}
                                        className="form-control input_field"
                                        required={true}
                                />
                            </div>

                            <div className="card-body">
                                <fieldset>
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
                            </div>

                            <div className="card-body">
                                <fieldset>
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
                            </div>

                            <div className="card-body">
                                <label htmlFor="relatve_humadity" className="form-label">
                                    Относительная влажность воздуха (%):
                                </label>
                                <input id="relatve_humadity" type="number"
                                        name="relatve humadity"
                                        min={16} max={97}
                                        className="form-control input_field"
                                        required={true}
                                />
                            </div>

                            <div className="card-body">
                                <label htmlFor="wind_direction" className="form-label">
                                    Направление ветра (°):
                                </label>
                                <input id="wind_direction" type="number"
                                        name="wind direction"
                                        min={6} max={360}
                                        className="form-control input_field"
                                        required={true}
                                />
                            </div>

                            <div className="card-body">
                                <label htmlFor="wind_speed" className="form-label">
                                    Скорость ветра (м/с):
                                </label>
                                <input id="wind_speed" type="number"
                                        name="wind speed"
                                        min={0} max={15}
                                        className="form-control input_field"
                                        required={true}
                                />
                            </div>
                        </div>

                        {/* Дополнительные данные */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-warning bg-opacity-10 border-warning border-opacity-25">
                                <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                                    <i className="bi bi-info-circle text-warning"></i>
                                    Дополнительная информация
                                </h5>
                                <small className="text-muted">Контекстные данные для более точного анализа</small>
                            </div>

                            <div className="card-body">
                                <label htmlFor="Lane_of_the_road" className="form-label">
                                    Полоса движения:
                                </label>
                                <input id="Lane_of_the_road" type="number"
                                        name="Lane of the road"
                                        min={1} max={2} step={1}
                                        className="form-control input_field"
                                        required={true}
                                />
                            </div>

                            <div className="card-body">
                                <label htmlFor="preceding_vehicle_time_gap" className="form-label">
                                    Временной интервал между транспортными средствами (сек):
                                </label>
                                <input id="preceding_vehicle_time_gap" type="number"
                                        name="preceding vehicle time-gap"
                                        min={3} max={1642}
                                        className="form-control input_field"
                                        required={true}
                                />
                            </div>

                            <div className="card-body">
                                <fieldset>
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
                            </div>

                            <div className="card-body">
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
                            </div>
                        </div>

                        {/* Кнопка отправки */}
                        <div className="d-flex gap-3 justify-content-center">
                            <button type="submit" className="btn btn-primary px-4 btn-lg">
                            <i className="bi bi-cpu me-2"></i>
                            Анализировать стиль вождения
                            </button>
                        </div>

                        {/* Модальное окно */}
                        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} resultPredict={JSON.stringify(predict)} />
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
}