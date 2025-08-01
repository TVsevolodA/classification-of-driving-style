"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import "./page.css";
import requestsToTheServer from '../../../components/requests_to_the_server';
import ClientIndividualStreamPage from './client_page';
import { Trip } from '../../../models/trip';

export default function IndividualStreamPage() {
    const searchParams = useSearchParams();
    const dataParam = searchParams.get('data');
    const tripId = dataParam ? JSON.parse(decodeURIComponent(dataParam)).tripId : null;
    const [tripData, setTripData] = useState<Trip>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!tripId) return;

        setLoading(true);
        setError(null);

        const url = `http://localhost:7000/trips?driver_car_id=${tripId}`;
        requestsToTheServer(url, 'GET')
        .then(res => {
            if (!res.ok) throw new Error('Ошибка загрузки данных');
            return res.data;
        })
        .then(data => {
            setTripData(data[0]);
        })
        .catch(err => {
            setError(err.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [tripId]);

    if (loading) {
        return (
        <div className="parent">
            <div className="loading">
                <strong>Загрузка информации...</strong>
                <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
            </div>
        </div>
        );
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }
    return <ClientIndividualStreamPage tripInfo = {tripData}></ClientIndividualStreamPage>
}