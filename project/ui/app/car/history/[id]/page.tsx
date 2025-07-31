"use client";

import { useParams } from 'next/navigation';
import requestsToTheServer from '../../../../components/requests_to_the_server';

export default function CarHistoryPage() {
    const params = useParams();
    const { id } = params;
    const req = async () => {
            const url = `http://localhost:7000/trips?driver_id=${id}`;
            const tripsData = await requestsToTheServer(url, 'GET');
            console.log(tripsData);
    };
    return (
        <div>
            <h1>История поездок авто с id {id}</h1>
            <button onClick={req} ></button>
        </div>
    );
}