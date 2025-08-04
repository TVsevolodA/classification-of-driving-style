"use client"
import { useState } from "react"
import "./car_history_page.css"
import { Trip } from "../../../../models/trip";
import { Car } from "../../../../models/car";
import { Driver } from "../../../../models/driver";
import { DriverCar } from "../../../../models/driverCar";

export default function TripHistory({ tripData }: { tripData: Trip[]; }) {
    const [selectedFilter, setSelectedFilter] = useState("all");

    const car: Car = tripData[0].car;
    const driver: Driver[] = tripData.map( (trip) => trip.driver );
    const trips: DriverCar[] = tripData.map( (trip) => trip.driver_car );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        });
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}ч ${mins}м`;
    };

    const formatMileage = (mileage: number) => {
        return new Intl.NumberFormat("ru-RU").format(mileage);
    };

    const getDriverInitials = (fullName: string) => {
        return fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .substring(0, 2);
    };

    const getTripStatus = (driverCar: DriverCar) => {
        if (driverCar.violations_per_trip > 0) return "violation";
        if (new Date(driverCar.end_date) > new Date()) return "active";
        return "completed";
    };

    const getTotalStats = () => {
        return {
        totalDistance: trips.reduce((sum, trip) => sum + trip.distance, 0),
        avgFuel: trips.reduce((sum, trip) => sum + trip.fuel_consumption / trips.length, 0),
        totalViolations: trips.reduce((sum, trip) => sum + trip.violations_per_trip, 0),
        avgSpeed: Math.round(trips.reduce((sum, trip) => sum + trip.average_speed, 0) / trips.length),
        };
    };

    const stats = getTotalStats();

    const filteredTrips = tripData.filter((trip) => {
        if (selectedFilter === "all") return true;
        if (selectedFilter === "violations") return trip.driver_car.violations_per_trip > 0;
        if (selectedFilter === "long") return trip.driver_car.distance > 200;
        return true;
    });

    return (
        <div className="container py-4">
        {/* Header */}
        <div className="row mb-4">
            <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                <h1 className="display-6 fw-bold mb-2">
                    <i className="bi bi-clock-history text-primary me-3"></i>
                    История поездок
                </h1>
                <p className="text-muted">Детальная информация о поездках автомобиля</p>
                </div>
            </div>
            </div>
        </div>

        {/* Car Info */}
        <div className="row mb-4">
            <div className="col-md-8">
            <div className="card car-info-card h-100">
                <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-car-front text-primary fs-2 me-3"></i>
                    <div>
                    <h5 className="mb-1">
                        {car.brand} {car.model}
                    </h5>
                    <small className="text-muted">{car.year} год</small>
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col-md-4">
                    <small className="text-muted">Госномер</small>
                    <div className="license-plate mt-1">{car.license_plate}</div>
                    </div>
                    <div className="col-md-4">
                    <small className="text-muted">Пробег</small>
                    <div className="fw-semibold mt-1">{formatMileage(car.mileage)} км</div>
                    </div>
                    {/* <div className="col-md-4">
                    <small className="text-muted">Водителей</small>
                    <div className="fw-semibold mt-1">
                        <i className="bi bi-people text-primary me-1"></i>
                        {stats.uniqueDrivers} человек
                    </div>
                    </div> */}
                </div>
                </div>
            </div>
            </div>
            <div className="col-md-4">
            <div className="card car-info-card h-100">
                <div className="card-body d-flex flex-column justify-content-center">
                <div className="text-center">
                    <i className="bi bi-graph-up text-success fs-1 mb-2"></i>
                    <h4 className="mb-1">Активность</h4>
                    <p className="text-muted mb-0">{trips.length} поездок за период</p>
                </div>
                </div>
            </div>
            </div>
        </div>

        {/* Statistics */}
        <div className="row mb-4">
            <div className="col-md-3 mb-3">
                <div className="card stat-card distance">
                    <div className="card-body text-center">
                        <i className="bi bi-speedometer2 fs-1 mb-2"></i>
                        <h3 className="mb-1">{formatMileage(stats.totalDistance)}</h3>
                        <small>Общий пробег (км)</small>
                    </div>
                </div>
            </div>
            <div className="col-md-3 mb-3">
                <div className="card stat-card fuel">
                    <div className="card-body text-center">
                        <i className="bi bi-fuel-pump fs-1 mb-2"></i>
                        <h3 className="mb-1">{stats.avgFuel.toFixed(1)}</h3>
                        <small>Средний расход топлива (л)</small>
                    </div>
                </div>
            </div>
            <div className="col-md-3 mb-3">
                <div className="card stat-card violations">
                    <div className="card-body text-center">
                        <i className="bi bi-exclamation-triangle fs-1 mb-2"></i>
                        <h3 className="mb-1">{stats.totalViolations}</h3>
                        <small>Нарушения</small>
                    </div>
                </div>
            </div>
            <div className="col-md-3 mb-3">
                <div className="card stat-card">
                    <div className="card-body text-center">
                        <div className="speed-gauge mx-auto mb-2">
                            <div className="speed-value">{stats.avgSpeed}</div>
                        </div>
                        <small>Средняя скорость (км/ч)</small>
                    </div>
                </div>
            </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
            <div className="col-12">
            <div className="btn-group" role="group">
                <button
                type="button"
                className={`btn ${selectedFilter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setSelectedFilter("all")}
                >
                <i className="bi bi-list me-1"></i>
                Все поездки ({trips.length})
                </button>
                <button
                type="button"
                className={`btn ${selectedFilter === "violations" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setSelectedFilter("violations")}
                >
                <i className="bi bi-exclamation-triangle me-1"></i>С нарушениями (
                {trips.filter((t) => t.violations_per_trip > 0).length})
                </button>
                <button
                type="button"
                className={`btn ${selectedFilter === "long" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setSelectedFilter("long")}
                >
                <i className="bi bi-arrow-up-right me-1"></i>
                Дальние ({trips.filter((t) => t.distance > 200).length})
                </button>
            </div>
            </div>
        </div>

        {/* Trips Timeline */}
        <div className="row">
            <div className="col-12">
            <h4 className="mb-4">
                <i className="bi bi-map me-2"></i>
                Список поездок
            </h4>
            {filteredTrips.map((trip) => (
                <div key={trip.driver_car.id} className="timeline-item">
                <div className="timeline-marker">
                    <i className="bi bi-geo-alt"></i>
                </div>
                <div className={`card trip-card trip-status-${getTripStatus(trip.driver_car)}`}>
                    <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                            <h5 className="mb-1">
                                <i className="bi bi-calendar3 text-muted me-2"></i>
                                {formatDate(trip.driver_car.start_date)}
                            </h5>
                            <small className="text-muted">
                                {formatTime(trip.driver_car.start_date)} - {formatTime(trip.driver_car.end_date)} ({formatDuration(trip.driver_car.duration)}
                                )
                            </small>
                            </div>
                            {trip.driver_car.violations_per_trip > 0 && (
                            <span className="violation-badge">
                                <i className="bi bi-exclamation-triangle me-1"></i>
                                {trip.driver_car.violations_per_trip} нарушение
                            </span>
                            )}
                        </div>

                        {/* Driver Info */}
                        <div className="d-flex align-items-center mb-3 p-2 bg-light rounded">
                            <div className="driver-avatar me-3">{getDriverInitials(trip.driver.full_name)}</div>
                            <div className="flex-grow-1">
                            <div className="fw-semibold">{trip.driver.full_name}</div>
                            <div className="d-flex align-items-center gap-3">
                                <small className="text-muted">
                                <i className="bi bi-clock me-1"></i>
                                Стаж: {trip.driver.driving_experience} лет
                                </small>
                                <small className="text-muted">
                                <span className="rating-stars me-1">
                                    {"★".repeat(Math.floor(trip.driver.driving_rating))}
                                    {"☆".repeat(5 - Math.floor(trip.driver.driving_rating))}
                                </span>
                                ({trip.driver.driving_rating})
                                </small>
                                <small className="text-muted">
                                <i className="bi bi-phone me-1"></i>
                                {trip.driver.phone}
                                </small>
                            </div>
                            </div>
                        </div>

                        <div className="trip-route">
                            <div className="route-line"></div>
                            <div className="d-flex align-items-center mb-3">
                            <div className="route-point start">
                                <i className="bi bi-play-fill"></i>
                            </div>
                            <div className="ms-3">
                                <div className="fw-semibold">Отправление</div>
                                <small className="text-muted">{trip.driver_car.place_departure}</small>
                            </div>
                            </div>
                            <div className="d-flex align-items-center">
                            <div className="route-point end">
                                <i className="bi bi-geo-alt-fill"></i>
                            </div>
                            <div className="ms-3">
                                <div className="fw-semibold">Прибытие</div>
                                <small className="text-muted">{trip.driver_car.place_destination}</small>
                            </div>
                            </div>
                        </div>
                        </div>

                        <div className="col-md-4">
                        <div className="row g-3 text-center">
                            <div className="col-6">
                            <div className="border rounded p-2">
                                <i className="bi bi-speedometer text-primary fs-4"></i>
                                <div className="fw-bold">{formatMileage(trip.driver_car.distance)}</div>
                                <small className="text-muted">км</small>
                            </div>
                            </div>
                            <div className="col-6">
                            <div className="border rounded p-2">
                                <i className="bi bi-fuel-pump text-success fs-4"></i>
                                <div className="fw-bold">{trip.driver_car.fuel_consumption}</div>
                                <small className="text-muted">литров</small>
                            </div>
                            </div>
                            <div className="col-6">
                            <div className="border rounded p-2">
                                <i className="bi bi-clock text-info fs-4"></i>
                                <div className="fw-bold">{trip.driver_car.average_speed}</div>
                                <small className="text-muted">км/ч</small>
                            </div>
                            </div>
                            <div className="col-6">
                            <div className="border rounded p-2">
                                <i className="bi bi-shield-check text-warning fs-4"></i>
                                <div className="fw-bold">{trip.driver.number_violations}</div>
                                <small className="text-muted">всего нарушений</small>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    )
}
