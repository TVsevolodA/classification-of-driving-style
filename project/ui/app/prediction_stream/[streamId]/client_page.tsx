import Hls from "hls.js";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Trip } from "../../../models/trip";
import requestsToTheServer from "../../../components/requests_to_the_server";
import { TripStatistics } from "../../../models/tripStatistics";

export default function ClientIndividualStreamPage({ tripInfo }: { tripInfo: Trip; }) {
    const { streamId } = useParams();

    const [tripHistory, setTripHistory] = useState<Trip[]>([]);
    const [tripStatistics, setTripStatistics] = useState([]);

    const calculateStatistics = (data: Trip[]) => {
        let statistics = new Map();
        for ( const trip of data) {
            const tripDate = trip.driver_car.start_date;
            let currentValue: TripStatistics = { quantity: 0, estimation: 0, violations: 0 };
            if ( statistics.has(tripDate) ) {
                currentValue = statistics.get(tripDate);
                currentValue.quantity += 1;
                currentValue.estimation = Math.round(
                    (
                        currentValue.estimation +
                        ( trip.driver.driving_rating * 100 / 5 )
                    )
                    / currentValue.quantity
                );
                currentValue.violations += trip.driver_car.violations_per_trip;
            }
            else {
                currentValue.quantity = 1;
                currentValue.estimation = Math.round( trip.driver.driving_rating * 100 / 5 );
                currentValue.violations = trip.driver_car.violations_per_trip;
            }
            statistics.set(tripDate, currentValue);
        }
        setTripStatistics( Array.from(statistics, ([date, tripStat]) => ({ date, tripStat })) );
    }

    const [activeTab, setActiveTab] = useState("live");
    const [liveData, setLiveData] = useState({
        speed: 0,
        rpm: 2100,
        temperature: 85,
        lastUpdate: '',
    });
    const getScoreColor = (score: number) => {
        if (score >= 90) return "success"
        if (score >= 70) return "warning"
        return "danger"
    }
    const videoRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [drivingStyle, setDrivingStyle] = useState("Идет анализ стиля...");
    const dictResult = new Map ([
        [1,  'Агрессивный'],
        [2,  'Нормальный'],
        [3,  'Неопределенный'],
    ]);
    const requestStory = async (nameTab: string) => {
        const url = `http://localhost:7000/trips?driver_id=${tripInfo.driver.id}`;
        const res = await requestsToTheServer(url, 'GET')
        if (!res.ok) throw new Error('Ошибка загрузки данных');
        setTripHistory(res.data);
        setActiveTab(nameTab);
        return res.data;
    };

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
            hls.loadSource(`http://localhost:5010/hls/stream${streamId}/live.m3u8`);
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
            if (Number(newDataObject["metadata"]["stream"]) === Number(streamId)) {
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
                                        className="position-absolute bottom-0 end-0 p-2 rounded-circle border border-3 border-white bg-success"
                                        style={{ width: "24px", height: "24px" }}
                                    />
                                </div>
                                <div>
                                    <h2 className="mb-1">
                                        {tripInfo.driver.full_name}
                                        <span className="badge bg-danger ms-2 animate-pulse">
                                        <i className="bi bi-broadcast me-1"></i>
                                        Онлайн
                                        </span>
                                    </h2>
                                    <p className="text-muted mb-1">
                                        <i className="bi bi-car-front me-2"></i>
                                        {tripInfo.car.brand} {tripInfo.car.model} • {tripInfo.car.license_plate}
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Быстрая статистика */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                <div className="card text-center h-100">
                    <div className="card-body">
                    <div className="display-6 text-success mb-2">{tripInfo.driver.driving_rating.toFixed(1)}</div>
                    <h6 className="card-title">Рейтинг безопасности</h6>
                    <div className="progress" style={{ height: "6px" }}>
                        <div className="progress-bar bg-success" style={{ width: `${tripInfo.driver.driving_rating * 100 / 5}%` }}></div>
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
                        <div className="display-6 text-warning mb-2">
                            {tripInfo.driver_car.violations_per_trip}
                        </div>
                        <h6 className="card-title">Нарушения сегодня</h6>
                        <small className="text-muted">за последние 24ч</small>
                    </div>
                </div>
                </div>
                {/* <div className="col-md-3">
                <div className="card text-center h-100">
                    <div className="card-body">
                    <div className="display-6 text-info mb-2">{driverDetail.totalTrips}</div>
                    <h6 className="card-title">Всего поездок</h6>
                    <small className="text-muted">за все время</small>
                    </div>
                </div>
                </div> */}
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
                            onClick={async () => await requestStory("trips")}
                            type="button"
                        >
                            <i className="bi bi-list me-2"></i>
                            История поездок
                        </button>
                        </li>
                        <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "analytics" ? "active" : ""}`}
                            onClick={async () => {
                                const stat = await requestStory("analytics");
                                calculateStatistics(stat);
                            }}
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
                                        <span>{tripInfo.driver.phone}</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div>
                                            <i className="bi bi-envelope me-2 text-muted"></i>
                                            <strong>Email:</strong>
                                        </div>
                                        <span>{tripInfo.driver.email}</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div>
                                            <i className="bi bi-calendar me-2 text-muted"></i>
                                            <strong>Стаж вождения:</strong>
                                        </div>
                                        <span>{tripInfo.driver.driving_experience}</span>
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
                                        <span>{tripInfo.driver_car.average_speed} км/ч</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div>
                                            <i className="bi bi-fuel-pump me-2 text-muted"></i>
                                            <strong>Расход топлива:</strong>
                                        </div>
                                        <span>{tripInfo.driver_car.fuel_consumption} л/100км</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div>
                                            <i className="bi bi-shield-check me-2 text-muted"></i>
                                            <strong>Рейтинг безопасности:</strong>
                                        </div>
                                        <span>
                                            {tripInfo.driver.driving_rating.toFixed(1)}/5.0
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
                                        <th>Дата</th>
                                        <th>Маршрут</th>
                                        <th>Расстояние (км)</th>
                                        <th>Длительность (мин)</th>
                                        <th>Ср. скорость (км/ч)</th>
                                        <th>Нарушения</th>
                                        <th>Балл</th>
                                        <th>Статус</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tripHistory.map((trip) => (
                                        <tr key={trip.driver_car.id}>
                                            <td>
                                                <div className="fw-medium">{trip.driver_car.start_date.split("T")[0]}</div>
                                            </td>
                                            <td>
                                                <div>
                                                    <div className="small">
                                                    <i className="bi bi-geo-alt text-success me-1"></i>
                                                    {trip.driver_car.place_departure}
                                                    </div>
                                                    <div className="small">
                                                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                                                    {trip.driver_car.place_destination}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{trip.driver_car.distance}</td>
                                            <td>{trip.driver_car.duration}</td>
                                            <td>{trip.driver_car.average_speed}</td>
                                            <td>
                                                {trip.driver_car.violations_per_trip > 0 && trip.driver_car.violations_per_trip < 5 ?
                                                ( <span className="badge bg-warning">{trip.driver_car.violations_per_trip}</span> ) :
                                                trip.driver_car.violations_per_trip > 5 ?
                                                ( <span className="badge bg-danger">{trip.driver_car.violations_per_trip}</span> ) :
                                                ( <span className="badge bg-success">0</span> )}
                                            </td>
                                            <td>
                                                <span className={`badge bg-${getScoreColor(trip.driver.driving_rating * 100 / 5)}`}>{Math.round(trip.driver.driving_rating * 100 / 5)}</span>
                                            </td>
                                            <td><span className="badge bg-success">Завершена</span></td>
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
                            <h5 className="mb-4">Статистика</h5>
                            <div className="row g-4">
                                {/* date, tripStat */}
                                {tripStatistics.map((record) => (
                                    <div key={(record["date"])} className="col-md-6 col-lg-4">
                                        <div className="card">
                                            <div className="card-body text-center">
                                                <h6 className="card-title">{record["date"].split("T")[0]}</h6>
                                                <div className="mb-3">
                                                    <div className="h4 text-primary">{record["tripStat"]["quantity"]}</div>
                                                    <small className="text-muted">поездок</small>
                                                </div>
                                                <div className="mb-2">
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <small>Средний балл</small>
                                                        <small className="fw-medium">{record["tripStat"]["estimation"]}</small>
                                                    </div>
                                                    <div className="progress" style={{ height: "6px" }}>
                                                        <div
                                                        className={`progress-bar bg-${getScoreColor(record["tripStat"]["estimation"])}`}
                                                        style={{ width: `${record["tripStat"]["estimation"]}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <small>Нарушения</small>
                                                    <span className={`badge bg-${record["tripStat"]["violations"] > 0 && record["tripStat"]["violations"] < 5 ? "warning" : record["tripStat"]["violations"] > 5 ? "danger": "success"}`}>
                                                        {record["tripStat"]["violations"]}
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
                                            <small className="text-muted">
                                                Действуют до {tripInfo.driver.expiration_driver_license.split("T")[0]}
                                            </small>
                                        </div>
                                        <span className="badge bg-success">Действует</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="bi bi-shield-check me-2 text-info"></i>
                                            <strong>Страховка</strong>
                                            <br />
                                            <small className="text-muted">
                                                Действует до {tripInfo.car.insurance_expiry_date.split("T")[0]}
                                            </small>
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
                                            <small className="text-muted">{tripInfo.car.date_technical_inspection.split("T")[0]}</small>
                                        </div>
                                        <span className="badge bg-success">Пройдено</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="bi bi-speedometer2 me-2 text-secondary"></i>
                                            <strong>Общий пробег</strong>
                                            <br />
                                            <small className="text-muted">{tripInfo.car.mileage}</small>
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