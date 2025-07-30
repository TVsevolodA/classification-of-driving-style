"use client";

import { useParams } from 'next/navigation';

export default function CarHistoryPage() {
        const params = useParams();
        const { id } = params;
    return (
        <h1>История поездок авто с id {id}</h1>
    );
}