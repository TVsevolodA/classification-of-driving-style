"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car } from "../../models/car";
import { Driver } from "../../models/driver";
import { Trip } from "../../models/trip";
import { DriverCar } from "../../models/driverCar";

function getDescriptionDivingStyle(rating: number) {
    if ( rating <= 1.6 ) return "aggressive";
    else if ( rating > 1.6 && rating <= 3.7 ) return "vague";
    else return "normal";
}

export default function MainStreamPage({ trips }: { trips: Trip[]; }) {
    console.log(trips);
    // Типы стилей вождения
    const drivingStyles = {
        normal: { label: "Безопасный", color: "success", textColor: "text-success", bgColor: "bg-success-subtle" },
        aggressive: { label: "Агрессивный", color: "danger", textColor: "text-danger", bgColor: "bg-danger-subtle" },
        vague: { label: "Умеренный", color: "warning", textColor: "text-warning", bgColor: "bg-warning-subtle" },
    };
    const [searchTerm, setSearchTerm] = useState("");
    const [styleFilter, setStyleFilter] = useState("all");
    // const [statusFilter, setStatusFilter] = useState("all");

    const filteredDrivers = () => {
        let suitableResult: Trip[] = [];
        for (const trip of trips) {
            const matchesSearch =
            trip.driver.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.car.license_plate.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStyle = styleFilter === "all" || getDescriptionDivingStyle(trip.driver.driving_rating) === styleFilter;
            if (matchesSearch && matchesStyle) {
                suitableResult.push( trip );
            }
        }
        return suitableResult;
    };

    const router = useRouter();
    const goToDetails = (tripId: number) => {
        const uniqueNumberStream = 2;
        const streamId = tripId % uniqueNumberStream + 1;
        const data = encodeURIComponent(JSON.stringify({"tripId": tripId}));
        router.push(`/prediction_stream/${streamId}?data=${data}`);
    }

    // const onlineDrivers = drivers.length;
    const avgScore = Math.round(trips.reduce((sum, trip) => sum + trip.driver.driving_rating, 0) / trips.length);
    const totalViolations = trips.reduce((sum, trip) => sum + trip.driver.number_violations, 0);

    return (
    <div className="min-vh-100 bg-light p-4">
        <div className="container-fluid">
            {/* Заголовок */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="display-5 fw-bold text-dark mb-1">Мониторинг стиля вождения</h1>
                    <p className="text-muted">Трансляции в режиме реального времени</p>
                </div>
                <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center text-success">
                        <div className="bg-success rounded-circle me-2" style={{ width: "8px", height: "8px" }}></div>
                        <small className="fw-medium">В сети</small>
                    </div>
                </div>
            </div>

            {/* Статистика */}
            <div className="row g-4 mb-4">
                {/* Водители онлайн */}
                {/* <div className="col-md-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p className="card-text text-muted small mb-1">Водители онлайн</p>
                                <h3 className="card-title mb-0">{onlineDrivers}</h3>
                            </div>
                            <div className="text-primary">
                                <i className="bi bi-people fs-2"></i>
                            </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Средний балл */}
                <div className="col-md-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="card-text text-muted small mb-1">Средний балл</p>
                                    <h3 className="card-title mb-0">{avgScore.toFixed(1)}</h3>
                                </div>
                                <div className="text-success">
                                    <i className="bi bi-graph-up fs-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Нарушения */}
                <div className="col-md-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="card-text text-muted small mb-1">Нарушения</p>
                                    <h3 className="card-title mb-0">{totalViolations}</h3>
                                </div>
                                <div className="text-warning">
                                    <i className="bi bi-exclamation-triangle fs-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Активные рейсы */}
                <div className="col-md-3">
                    <div className="card h-100">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <p className="card-text text-muted small mb-1">Активные рейсы</p>
                            <h3 className="card-title mb-0">{trips.length}</h3>
                        </div>
                        <div className="text-info">
                            <i className="bi bi-activity fs-2"></i>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            {/* Фильтры */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Поиск по имени или номеру..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <select className="form-select" value={styleFilter} onChange={(e) => setStyleFilter(e.target.value)}>
                            <option value="all">Все стили</option>
                            <option value="normal">Безопасный</option>
                            <option value="aggressive">Агрессивный</option>
                            {/* <option value="economical">Экономичный</option> */}
                            <option value="vague">Умеренный</option>
                            {/* <option value="risky">Рискованный</option> */}
                            </select>
                        </div>

                        {/* <div className="col-md-3">
                            <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">Все</option>
                            <option value="online">Онлайн</option>
                            <option value="offline">Офлайн</option>
                            </select>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Список водителей */}
            <div className="row g-4">
            {filteredDrivers().map((selectionElement) => {
                const driver: Driver = selectionElement.driver;
                const car: Car = selectionElement.car;
                const driverCar: DriverCar = selectionElement.driver_car;
                const style = drivingStyles[
                    getDescriptionDivingStyle(driver.driving_rating) as keyof typeof drivingStyles
                ];

                const uiid = `${car.id}${driver.id}`;
                return (
                <div key={uiid} className="col-lg-6">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="d-flex align-items-center">
                                    <div>
                                        <h6 className="card-title mb-1">{driver.full_name}</h6>
                                        <p className="card-text text-muted small mb-0">{car.brand} {car.model}</p>
                                        <p className="card-text text-muted small">{car.license_plate}</p>
                                    </div>
                                </div>

                                <span className={`badge bg-${style.color}`}>{style.label}</span>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-speedometer2 me-2"></i>
                                        <span className="text-muted me-2">Средняя скорость:</span>
                                        {/* <span className="fw-bold">
                                            {car.average_speed} км/ч
                                        </span> */}
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="text-muted me-2">Балл:</span>
                                        <span
                                            className={`fw-bold ${
                                            driver.driving_rating >= 90 ? "text-success" : driver.driving_rating >= 70 ? "text-warning" : "text-danger"
                                            }`}
                                        >
                                            {driver.driving_rating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* <div className="d-flex align-items-center text-muted small mb-2">
                                    <i className="bi bi-geo-alt me-2"></i>
                                    <span className="text-truncate">
                                        Местоположение:
                                        {driver.location}
                                    </span>
                                </div> */}

                                <div className="d-flex justify-content-between align-items-center">
                                    {/* <div className="d-flex align-items-center text-muted small">
                                        <i className="bi bi-clock me-2"></i>
                                        <span>
                                            Последнее обновление
                                            {driver.lastUpdate}
                                        </span>
                                    </div> */}

                                    <div className="d-flex align-items-center">
                                        {driver.number_violations > 0 ? (
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-x-circle me-2"></i>
                                                <span className="me-2">Количество нарушений:</span>
                                                <span className="fw-bold text-danger">{driver.number_violations}</span>
                                            </div>
                                        ) : (
                                            <div className="d-flex align-items-center text-success">
                                            <i className="bi bi-check-circle me-1"></i>
                                            <span className="small">нарушений нет</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="border-top pt-3">
                                <div className="row g-2">
                                    <button className="btn btn-outline-primary btn-sm w-100" onClick={ () => goToDetails(driverCar.id)}>
                                        <i className="bi bi-car-front me-2"></i>
                                        Детали
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )
            })}
            </div>

            {filteredDrivers().length === 0 && (
            <div className="card">
                <div className="card-body text-center py-5">
                <div className="text-muted mb-3">
                    <i className="bi bi-people display-4"></i>
                </div>
                <h5 className="card-title">Водители не найдены</h5>
                <p className="card-text text-muted">Попробуйте изменить параметры поиска или фильтры</p>
                </div>
            </div>
            )}
        </div>
    </div>
    )
}