import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function AnimatedRouteMap() {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const routeLineRef = useRef(null);

    useEffect(() => {
    if (!mapRef.current) {
        // Инициализация карты
        mapRef.current = L.map('map').setView([55.75, 37.62], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        }).addTo(mapRef.current);

        const routeCoords = [
            [55.75, 37.62],
            [55.92, 37.34],
        ];

        // Рисуем маршрут
        routeLineRef.current = L.polyline(routeCoords, { color: 'blue', weight: 5 }).addTo(mapRef.current);

        // Создаём маркер в начале маршрута
        markerRef.current = L.marker(routeCoords[0]).addTo(mapRef.current);

        // Функция линейной интерполяции
        function interpolatePoint(start, end, t) {
            return [
                start[0] + (end[0] - start[0]) * t,
                start[1] + (end[1] - start[1]) * t,
            ];
        }

        let progress = 0;
        const animationDuration = 10000; // 10 секунд
        const frameRate = 60;
        const step = 1 / (animationDuration / (1000 / frameRate));

        function animate() {
            progress += step;
            if (progress > 1) progress = 1;

            const pos = interpolatePoint(routeCoords[0], routeCoords[1], progress);
            markerRef.current.setLatLng(pos);
            mapRef.current.panTo(pos, { animate: true, duration: 0.5 });

            if (progress < 1) requestAnimationFrame(animate);
        }
        animate();
    }

    // Очистка карты при размонтировании компонента
    return () => {
        if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        }
    };
    }, []);

    return (
    <div
        id="map"
        style={{ height: '500px', width: '100%' }}
    />
    );
}