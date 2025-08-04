"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import './page.css';
import requestsToTheServer from '../../../../components/requests_to_the_server';
import TripHistory from './car_history_page';
import { Trip } from '../../../../models/trip';
import TripHistoryEmpty from './not_found_history_trip';

export default function CarHistoryPage() {
    const { id } = useParams();
    const [tripData, setTripData] = useState<Trip[]>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setError(null);

        const url = `http://localhost:7000/trips?car_id=${id}`;
        requestsToTheServer(url, 'GET')
        .then(res => {
            if (!res.ok) throw new Error('Ошибка загрузки данных');
            return res.data;
        })
        .then(data => {
            setTripData(data);
        })
        .catch(err => {
            setError(err.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
        <div className="parent">
            <div className="loading">
                <strong>Загрузка истории...</strong>
                <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
            </div>
        </div>
        );
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if (!tripData || tripData.length === 0) {
        return <TripHistoryEmpty/>;
    }

    return ( <TripHistory tripData={tripData} /> );
}