'use client';

import { FormEvent } from "react";

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
        // {"veincle length": 441, "veincle weight": 1380, "axles number": 2, "perceding veincle time-gap": 10, "Lane of the road": 2, "veincle speed": 150, "perceding veincle speed": 100, "perceding veincle weight": 2021, "perceding veincle length": 500, "road condition": 1, "Air temprture": 15, "perciption type": 0, "perciption intensity": -1, "relatve humadity": 60, "wind direction": 100, "wind speed": 10, "Lighting condition": 2}
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
    return (
    <form onSubmit={onSubmit} autoComplete="on">
        <label htmlFor="veincle_length">Длина транспортного средства:</label>
        <input id="veincle_length" type="number" name="veincle length" required={true} />
        <button type="submit">Отправить</button>
    </form>
    );
}