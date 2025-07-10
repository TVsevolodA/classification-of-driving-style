"use client";
import Hls from 'hls.js';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import "./page.css";
// import RouteMap from '../../../components/RouteMap';

export default function Page() {
    // Моковые данные для детального просмотра водителя
    const driverDetail = {
    id: 1,
    name: "Алексей Петров",
    vehicle: "Toyota Camry",
    plateNumber: "А123БВ77",
    style: "safe",
    speed: 65,
    location: "Москва, Тверская ул.",
    lastUpdate: "2 мин назад",
    score: 95,
    violations: 0,
    isOnline: true,
    phone: "+7 (999) 123-45-67",
    email: "alexey.petrov@example.com",
    experience: "5 лет",
    totalDistance: "125,430 км",
    totalTrips: 1247,
    avgSpeed: 62,
    fuelEfficiency: 7.2,
    safetyRating: 4.8,
    lastMaintenance: "12.12.2024",
    insurance: "15.06.2025",
    license: "22.08.2027",
    }

    // История поездок
    const tripHistory = [
        {
        id: 1,
        date: "30.12.2024",
        time: "14:30",
        from: "Красная площадь",
        to: "Шереметьево",
        distance: "45 км",
        duration: "1ч 15мин",
        avgSpeed: "58 км/ч",
        violations: 1,
        score: 98,
        status: "completed",
        },
        {
        id: 2,
        date: "30.12.2024",
        time: "11:45",
        from: "Арбат",
        to: "Сокольники",
        distance: "28 км",
        duration: "45мин",
        avgSpeed: "62 км/ч",
        violations: 1,
        score: 85,
        status: "completed",
        },
        {
        id: 3,
        date: "29.12.2024",
        time: "18:20",
        from: "Тверская",
        to: "Крылатское",
        distance: "32 км",
        duration: "1ч 5мин",
        avgSpeed: "55 км/ч",
        violations: 0,
        score: 92,
        status: "completed",
        },
        {
        id: 4,
        date: "29.12.2024",
        time: "09:15",
        from: "Домодедово",
        to: "Центр",
        distance: "52 км",
        duration: "1ч 30мин",
        avgSpeed: "48 км/ч",
        violations: 2,
        score: 78,
        status: "completed",
        },
    ]

    // Статистика по дням недели
    const weeklyStats = [
        { day: "Пн", trips: 8, avgScore: 60, violations: 10 },
        { day: "Вт", trips: 12, avgScore: 88, violations: 2 },
        { day: "Ср", trips: 10, avgScore: 95, violations: 0 },
        { day: "Чт", trips: 15, avgScore: 87, violations: 3 },
        { day: "Пт", trips: 18, avgScore: 90, violations: 2 },
        { day: "Сб", trips: 14, avgScore: 93, violations: 1 },
        { day: "Вс", trips: 6, avgScore: 96, violations: 0 },
    ]

    const [activeTab, setActiveTab] = useState("live");
    const [liveData, setLiveData] = useState({
        speed: 0,
        rpm: 2100,
        temperature: 85,
        lastUpdate: '',
    });

    // Симуляция обновления данных в реальном времени
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setLiveData((prev) => ({
    //         ...prev,
    //         speed: Math.max(10, prev.speed + (Math.random() - 0.5) * 10),
    //         rpm: Math.max(1200, prev.rpm + (Math.random() - 0.5) * 200),
    //         temperature: Math.max(70, Math.min(90, prev.temperature + (Math.random() - 0.5) * 5)),
    //         lastUpdate: new Date().toLocaleTimeString(),
    //         }));
    //     }, 2000);

    //     return () => clearInterval(interval);
    // }, []);

    const getScoreColor = (score: number) => {
        if (score >= 90) return "success"
        if (score >= 70) return "warning"
        return "danger"
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
            return <span className="badge bg-success">Завершена</span>
            case "active":
            return <span className="badge bg-primary">Активна</span>
            case "cancelled":
            return <span className="badge bg-danger">Отменена</span>
            default:
            return <span className="badge bg-secondary">Неизвестно</span>
        }
    }

    // Показать местоположение авто на карте
    // function showMap() {
    //     setActiveTab("live");
    //     window.scrollTo(0, document.body.scrollHeight);
    // }

    const params = useParams();
    const { stream } = params;
    const videoRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [drivingStyle, setDrivingStyle] = useState("Идет анализ стиля...");
    const dictResult = new Map ([
        [1,  'Агрессивный'],
        [2,  'Нормальный'],
        [3,  'Неопределенный'],
    ]);

    useEffect(() => {
        setDrivingStyle( estimationAverageIndicator() );
    }, [messages]);

    // Функция для оценивания усредненного показателя вождени
    function estimationAverageIndicator(): string {
        if (messages.length === 0) return "Идет анализ стиля...";
        const sumElements = messages.reduce((partialSum, a) => partialSum + a, 0);
        const countElements = messages.length;
        const avgValue = Math.round(sumElements / countElements);
        return dictResult.get(avgValue) + " стиль";
    }

    // Подключеие видеотрансляции
    useEffect(() => {
        if (activeTab === "live" && videoRef.current && Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(`http://localhost:5010/hls/stream${stream}/live.m3u8`);
            hls.attachMedia(videoRef.current);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoRef.current.play();
            });
            return () => {
                hls.destroy();
            };
        }
    }, [activeTab]);

    // Работа с вебсокетом
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:7000/tracking");

        socket.onopen = () => {
            console.log('Соединение установлено');
        };

        socket.onmessage = (event) => {
            const newDataObject = JSON.parse(event.data);
            if (Number(newDataObject["metadata"]["stream"]) === Number(stream)) {
                // console.log(event.data);
                setLiveData((prev) => ({
                    ...prev,
                    speed: newDataObject["metadata"]["speed"],
                    rpm: Math.max(1200, prev.rpm + (Math.random() - 0.5) * 200),
                    temperature: Math.max(70, Math.min(90, prev.temperature + (Math.random() - 0.5) * 5)),
                    lastUpdate: new Date().toLocaleTimeString(),
                }));
                const predictionResult = Number(newDataObject["result"]);
                setMessages(prev => {
                    let queue = [predictionResult, ...prev];
                    if (queue.length > 50) queue = queue.slice(queue.length - 50);
                    return queue;
                });
            }
        };

        socket.onerror = (error) => {
            console.log('Ошибка WebSocket', error);
        };

        socket.onclose = () => {
            console.log('Соединение закрыто');
        };

        return () => {
            // Закрываем соединение при размонтировании
            socket.close();
        };
    }, []);
    return (
        <div className="min-vh-100 bg-light p-4">
            {/* Заголовок с основной информацией */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <div className="d-flex align-items-center">
                                <div className="position-relative me-4">
                                    <i className="bi bi-person fs-1"/>
                                    <span
                                        className={`position-absolute bottom-0 end-0 p-2 rounded-circle border border-3 border-white ${
                                        driverDetail.isOnline ? "bg-success" : "bg-secondary"
                                        }`}
                                        style={{ width: "24px", height: "24px" }}
                                    />
                                </div>
                                <div>
                                    <h2 className="mb-1">
                                        {driverDetail.name}
                                        <span className="badge bg-danger ms-2 animate-pulse">
                                        <i className="bi bi-broadcast me-1"></i>
                                        Онлайн
                                        </span>
                                    </h2>
                                    <p className="text-muted mb-1">
                                        <i className="bi bi-car-front me-2"></i>
                                        {driverDetail.vehicle} • {driverDetail.plateNumber}
                                    </p>
                                    <p className="text-muted small mb-0">
                                        <i className="bi bi-clock me-2"></i>
                                        Обновлено: {liveData.lastUpdate}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 text-md-end">
                            <div className="mb-3">
                                <span className="badge bg-success fs-6 px-3 py-2">
                                    {drivingStyle}
                                </span>
                            </div>
                            {/* <div className="d-flex justify-content-md-end gap-2">
                                <button className="btn btn-outline-secondary" onClick={showMap}>
                                    <i className="bi bi-geo-alt me-2"></i>
                                    Показать на карте
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Быстрая статистика */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                <div className="card text-center h-100">
                    <div className="card-body">
                    <div className="display-6 text-success mb-2">{driverDetail.score}</div>
                    <h6 className="card-title">Рейтинг безопасности</h6>
                    <div className="progress" style={{ height: "6px" }}>
                        <div className="progress-bar bg-success" style={{ width: `${driverDetail.score}%` }}></div>
                    </div>
                    </div>
                </div>
                </div>
                <div className="col-md-3">
                <div className="card text-center h-100">
                    <div className="card-body">
                    <div className="display-6 text-primary mb-2">{Math.round(liveData.speed)}</div>
                    <h6 className="card-title">Текущая скорость</h6>
                    <small className="text-muted">км/ч</small>
                    </div>
                </div>
                </div>
                <div className="col-md-3">
                <div className="card text-center h-100">
                    <div className="card-body">
                    <div className="display-6 text-warning mb-2">{driverDetail.violations}</div>
                    <h6 className="card-title">Нарушения сегодня</h6>
                    <small className="text-muted">за последние 24ч</small>
                    </div>
                </div>
                </div>
                <div className="col-md-3">
                <div className="card text-center h-100">
                    <div className="card-body">
                    <div className="display-6 text-info mb-2">{driverDetail.totalTrips}</div>
                    <h6 className="card-title">Всего поездок</h6>
                    <small className="text-muted">за все время</small>
                    </div>
                </div>
                </div>
            </div>

            {/* Табы с детальной информацией */}
            <div className="card">
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs" role="tablist">
                        <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "live" ? "active" : ""}`}
                            onClick={() => setActiveTab("live") }
                            type="button"
                        >
                            <i className="bi bi-broadcast me-2"></i>
                            Прямая трансляция
                            <span className="badge bg-danger ms-2">Онлайн</span>
                        </button>
                        </li>
                        <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
                            onClick={() => setActiveTab("overview")}
                            type="button"
                        >
                            <i className="bi bi-person me-2"></i>
                            Обзор
                        </button>
                        </li>
                        <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "trips" ? "active" : ""}`}
                            onClick={() => setActiveTab("trips")}
                            type="button"
                        >
                            <i className="bi bi-list me-2"></i>
                            История поездок
                        </button>
                        </li>
                        <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "analytics" ? "active" : ""}`}
                            onClick={() => setActiveTab("analytics")}
                            type="button"
                        >
                            <i className="bi bi-graph-up me-2"></i>
                            Аналитика
                        </button>
                        </li>
                        <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "documents" ? "active" : ""}`}
                            onClick={() => setActiveTab("documents")}
                            type="button"
                        >
                            <i className="bi bi-file-text me-2"></i>
                            Документы
                        </button>
                        </li>
                    </ul>
                </div>
                <div className="card-body">
                    {/* Вкладка "Прямая трансляция" */}
                    {activeTab === "live" && (
                        <div className="row g-4">
                            {/* Видео трансляция */}
                            <div className="col-lg-8">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0">
                                            <i className="bi bi-camera-video me-2"></i>
                                            Видео с камеры
                                        </h6>
                                        <div className="d-flex align-items-center">
                                            <span className="badge bg-danger me-2">
                                                <i className="bi bi-record-circle me-1"></i>
                                                Запись
                                            </span>
                                            <span className="text-muted small">{liveData.lastUpdate}</span>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="position-relative bg-dark" style={{ height: "400px" }}>
                                            <video ref={videoRef} id="video" className="w-100 h-100 object-fit-cover" controls={true} autoPlay={true} />
                                            <div className="position-absolute top-0 start-0 p-3">
                                                <span className="badge bg-danger">
                                                    <i className="bi bi-broadcast me-1"></i>
                                                    Онлайн
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Карта в реальном времени */}
                                {/* <div className="card mt-4">
                                    <div className="card-header">
                                        <h6 className="mb-0">
                                            <i className="bi bi-map me-2"></i>
                                            Местоположение в реальном времени
                                        </h6>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="position-relative bg-light" style={{ height: "300px" }}>
                                            <RouteMap />
                                        </div>
                                    </div>
                                </div> */}
                            </div>

                            {/* Телематика в реальном времени */}
                            <div className="col-lg-4">
                                <div className="card">
                                    <div className="card-header">
                                        <h6 className="mb-0">
                                            <i className="bi bi-speedometer2 me-2"></i>
                                            Телематика
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                    {/* Скорость */}
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-medium">Скорость</span>
                                                <span className="h5 mb-0 text-primary">{Math.round(liveData.speed)} км/ч</span>
                                            </div>
                                            <div className="progress" style={{ height: "8px" }}>
                                                <div
                                                    className="progress-bar bg-primary"
                                                    style={{ width: `${Math.min(100, (liveData.speed / 120) * 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Обороты двигателя */}
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-medium">Обороты</span>
                                            <span className="h6 mb-0">{Math.round(liveData.rpm)} об/мин</span>
                                            </div>
                                            <div className="progress" style={{ height: "8px" }}>
                                            <div
                                                className="progress-bar bg-info"
                                                style={{ width: `${Math.min(100, (liveData.rpm / 6000) * 100)}%` }}
                                            ></div>
                                            </div>
                                        </div>

                                        {/* Температура */}
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-medium">Температура</span>
                                                <span className="h6 mb-0">{Math.round(liveData.temperature)}°C</span>
                                            </div>
                                            <div className="progress" style={{ height: "8px" }}>
                                                <div
                                                    className={`progress-bar ${
                                                    liveData.temperature > 100
                                                        ? "bg-danger"
                                                        : liveData.temperature > 90
                                                        ? "bg-warning"
                                                        : "bg-success"
                                                    }`}
                                                    style={{ width: `${Math.min(100, (liveData.temperature / 120) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Статус систем */}
                                <div className="card mt-4">
                                    <div className="card-header">
                                        <h6 className="mb-0">
                                            <i className="bi bi-gear me-2"></i>
                                            Статус систем
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="list-group list-group-flush">
                                            {/* <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                                <div>
                                                    <i className="bi bi-speedometer me-2"></i>
                                                    Ускорение
                                                </div>
                                                <span className={`badge bg-${getEngineStatusColor(liveData.accelerationStatus)}`}>
                                                    Норма
                                                </span>
                                            </div> */}
                                            <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                                <div>
                                                    <i className="bi bi-wifi me-2"></i>
                                                    Связь
                                                </div>
                                                <span className="badge bg-success">Хорошая</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                
                    {/* Вкладка "Обзор" */}
                    {activeTab === "overview" && (
                        <div className="row g-4">
                            <div className="col-md-6">
                                <h5 className="mb-3">Личная информация</h5>
                                <div className="list-group list-group-flush">
                                    <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div>
                                            <i className="bi bi-telephone me-2 text-muted"></i>
                                            <strong>Телефон:</strong>
                                        </div>
                                        <span>{driverDetail.phone}</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div>
                                            <i className="bi bi-envelope me-2 text-muted"></i>
                                            <strong>Email:</strong>
                                        </div>
                                        <span>{driverDetail.email}</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div>
                                            <i className="bi bi-calendar me-2 text-muted"></i>
                                            <strong>Стаж вождения:</strong>
                                        </div>
                                        <span>{driverDetail.experience}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <h5 className="mb-3">Статистика вождения</h5>
                                <div className="list-group list-group-flush">
                                    <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div>
                                            <i className="bi bi-speedometer me-2 text-muted"></i>
                                            <strong>Средняя скорость:</strong>
                                        </div>
                                        <span>{driverDetail.avgSpeed} км/ч</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div>
                                            <i className="bi bi-fuel-pump me-2 text-muted"></i>
                                            <strong>Расход топлива:</strong>
                                        </div>
                                        <span>{driverDetail.fuelEfficiency} л/100км</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div>
                                            <i className="bi bi-shield-check me-2 text-muted"></i>
                                            <strong>Рейтинг безопасности:</strong>
                                        </div>
                                        <span>
                                            {driverDetail.safetyRating}/5.0
                                            <i className="bi bi-star-fill text-warning ms-1"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Вкладка "История поездок" */}
                    {activeTab === "trips" && (
                        <div>
                            <div className="mb-3">
                                <h5 className="mb-0">Последние поездки</h5>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="table-light">
                                        <tr>
                                        <th>Дата/Время</th>
                                        <th>Маршрут</th>
                                        <th>Расстояние</th>
                                        <th>Длительность</th>
                                        <th>Ср. скорость</th>
                                        <th>Нарушения</th>
                                        <th>Балл</th>
                                        <th>Статус</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tripHistory.map((trip) => (
                                        <tr key={trip.id}>
                                            <td>
                                                <div>
                                                    <div className="fw-medium">{trip.date}</div>
                                                    <small className="text-muted">{trip.time}</small>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <div className="small">
                                                    <i className="bi bi-geo-alt text-success me-1"></i>
                                                    {trip.from}
                                                    </div>
                                                    <div className="small">
                                                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                                                    {trip.to}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{trip.distance}</td>
                                            <td>{trip.duration}</td>
                                            <td>{trip.avgSpeed}</td>
                                            <td>
                                                {trip.violations > 0 && trip.violations < 5 ?
                                                ( <span className="badge bg-warning">{trip.violations}</span> ) :
                                                trip.violations > 5 ?
                                                ( <span className="badge bg-danger">{trip.violations}</span> ) :
                                                ( <span className="badge bg-success">0</span> )}
                                            </td>
                                            <td>
                                                <span className={`badge bg-${getScoreColor(trip.score)}`}>{trip.score}</span>
                                            </td>
                                            <td>{getStatusBadge(trip.status)}</td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Вкладка "Аналитика" */}
                    {activeTab === "analytics" && (
                        <div>
                            <h5 className="mb-4">Статистика по дням недели</h5>
                            <div className="row g-4">
                                {weeklyStats.map((stat) => (
                                    <div key={stat.day} className="col-md-6 col-lg-4">
                                        <div className="card">
                                            <div className="card-body text-center">
                                                <h6 className="card-title">{stat.day}</h6>
                                                <div className="mb-3">
                                                    <div className="h4 text-primary">{stat.trips}</div>
                                                    <small className="text-muted">поездок</small>
                                                </div>
                                                <div className="mb-2">
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <small>Средний балл</small>
                                                        <small className="fw-medium">{stat.avgScore}</small>
                                                    </div>
                                                    <div className="progress" style={{ height: "6px" }}>
                                                        <div
                                                        className={`progress-bar bg-${getScoreColor(stat.avgScore)}`}
                                                        style={{ width: `${stat.avgScore}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <small>Нарушения</small>
                                                    <span className={`badge bg-${stat.violations > 0 && stat.violations < 5 ? "warning" : stat.violations > 5 ? "danger": "success"}`}>
                                                        {stat.violations}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Вкладка "Документы" */}
                    {activeTab === "documents" && (
                        <div className="row g-4">
                            <div className="col-md-6">
                                <h5 className="mb-3">Документы водителя</h5>
                                <div className="list-group">
                                    <div className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="bi bi-card-text me-2 text-primary"></i>
                                            <strong>Водительские права</strong>
                                            <br />
                                            <small className="text-muted">Действуют до {driverDetail.license}</small>
                                        </div>
                                        <span className="badge bg-success">Действует</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="bi bi-shield-check me-2 text-info"></i>
                                            <strong>Страховка</strong>
                                            <br />
                                            <small className="text-muted">Действует до {driverDetail.insurance}</small>
                                        </div>
                                        <span className="badge bg-success">Действует</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <h5 className="mb-3">Техническое обслуживание</h5>
                                <div className="list-group">
                                    <div className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="bi bi-tools me-2 text-warning"></i>
                                            <strong>Последнее ТО</strong>
                                            <br />
                                            <small className="text-muted">{driverDetail.lastMaintenance}</small>
                                        </div>
                                        <span className="badge bg-success">Пройдено</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="bi bi-speedometer2 me-2 text-secondary"></i>
                                            <strong>Общий пробег</strong>
                                            <br />
                                            <small className="text-muted">{driverDetail.totalDistance}</small>
                                        </div>
                                        <span className="badge bg-info">Актуально</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}