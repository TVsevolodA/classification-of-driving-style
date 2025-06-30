import { LngLatLike, Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';

export default function RouteMap() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const markerRef = useRef<Marker | null>(null);

    // Маршрут (массив координат [lng, lat])
    const route: Array<LngLatLike> = [
        [51.531539,45.983693],
        [51.531422,45.983646],
        [51.531326,45.983601],
        [51.531260,45.983573],
        [51.531168,45.983526],
        [51.531091,45.983455],
        [51.531058,45.983337],
        [51.531076,45.983180],
        [51.531099,45.982989],
        [51.531135,45.982760],
        [51.531180,45.982496],
        [51.531220,45.982239],
        [51.531255,45.982023],
        [51.531278,45.981840],
        [51.531302,45.981651],
        [51.531336,45.981448],
        [51.531373,45.981248],
        [51.531401,45.981061],
        [51.531422,45.980883],
        [51.531442,45.980713],
        [51.531438,45.980562],
        [51.531420,45.980478],
        [51.531413,45.980465],
        [51.531413,45.980467],
        [51.531398,45.980450],
        [51.531352,45.980403],
        [51.531307,45.980377],
        [51.531234,45.980349],
        [51.531175,45.980324],
        [51.531128,45.980306],
        [51.531081,45.980287],
        [51.531042,45.980269],
        [51.531001,45.980246],
        [51.530978,45.980235],
        [51.530953,45.980224],
        [51.530926,45.980209],
        [51.530876,45.980178],
        [51.530789,45.980140],
        [51.530678,45.980100],
        [51.530539,45.980050],
        [51.530392,45.979998],
        [51.530251,45.979935],
        [51.530115,45.979879],
    ];

    useEffect(() => {
    if (!mapContainer.current) return;

    const map = new Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        // https://basemaps.cartocdn.com/gl/positron-gl-style/style.jsonhttps://raw.githubusercontent.com/teamapps-org/maplibre-gl-styles/refs/heads/main/example-tileserver-config.json
        // https://demotiles.maplibre.org/style.json
        // https://basemaps.cartocdn.com/gl/positron-gl-style/style.json
        center: route[0],
        zoom: 13
    });

    mapRef.current = map;

    map.on('load', () => {
        // Добавим маршрутную линию
        map.addSource("route", {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": route as number[][]
                },
                "properties": {}
            }
        });

        map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#007AFF',
            'line-width': 4
        }
        });

        // Маркер
        const marker = new Marker({ color: 'red' })
        .setLngLat(route[0])
        .addTo(map);

        markerRef.current = marker;

        // Анимация движения
        let index = 0;

        function moveMarker() {
        if (index >= route.length) return;
        marker.setLngLat(route[index]);
        index++;
        setTimeout(moveMarker, 600);
        }

        moveMarker();
    });

    return () => {
        map.remove();
    };
    }, []);

    return ( <div ref={mapContainer} style={{ width: "100%", height: "400px" }} /> );
}