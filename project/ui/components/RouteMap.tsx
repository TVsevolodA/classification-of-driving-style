import { LngLatLike, Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';

export default function RouteMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  // Пример маршрута (массив координат [lng, lat])
  const route: Array<LngLatLike> = [
    [30.3141, 59.9386], // Санкт-Петербург
    [30.3200, 59.9400],
    [30.3250, 59.9420],
    [30.3300, 59.9450]
  ];

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
      center: route[0],
      zoom: 13
    });

    mapRef.current = map;

    map.on('load', () => {
      // Добавим маршрутную линию
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: route as number[][]
          }
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
        setTimeout(moveMarker, 600); // каждые 200мс
      }

      moveMarker();
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}