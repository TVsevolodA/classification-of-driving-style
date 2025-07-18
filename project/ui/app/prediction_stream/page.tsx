"use client";
import { useState } from "react";

export default function MainStreamPage() {
    // Типы стилей вождения
    const drivingStyles = {
    safe: { label: "Безопасный", color: "success", textColor: "text-success", bgColor: "bg-success-subtle" },
    aggressive: { label: "Агрессивный", color: "danger", textColor: "text-danger", bgColor: "bg-danger-subtle" },
    economical: { label: "Экономичный", color: "primary", textColor: "text-primary", bgColor: "bg-primary-subtle" },
    moderate: { label: "Умеренный", color: "warning", textColor: "text-warning", bgColor: "bg-warning-subtle" },
    risky: { label: "Рискованный", color: "danger", textColor: "text-danger", bgColor: "bg-danger-subtle" },
    }

    // Моковые данные водителей
    const drivers = [
    {
        id: 1,
        name: "Алексей Петров",
        avatar: "/placeholder.svg?height=40&width=40",
        vehicle: "Toyota Camry",
        plateNumber: "А123БВ77",
        style: "safe",
        speed: 65,
        location: "Москва, Тверская ул.",
        lastUpdate: "2 мин назад",
        score: 95,
        violations: 0,
        isOnline: true,
    },
    {
        id: 2,
        name: "Мария Сидорова",
        avatar: "/placeholder.svg?height=40&width=40",
        vehicle: "Honda Civic",
        plateNumber: "В456ГД77",
        style: "aggressive",
        speed: 85,
        location: "Москва, Садовое кольцо",
        lastUpdate: "1 мин назад",
        score: 72,
        violations: 3,
        isOnline: true,
    },
    {
        id: 3,
        name: "Дмитрий Козлов",
        avatar: "/placeholder.svg?height=40&width=40",
        vehicle: "Volkswagen Polo",
        plateNumber: "С789ЕЖ77",
        style: "economical",
        speed: 55,
        location: "Москва, Ленинский пр-т",
        lastUpdate: "30 сек назад",
        score: 88,
        violations: 1,
        isOnline: true,
    },
    {
        id: 4,
        name: "Елена Волкова",
        avatar: "/placeholder.svg?height=40&width=40",
        vehicle: "Nissan Qashqai",
        plateNumber: "Д012ЗИ77",
        style: "moderate",
        speed: 70,
        location: "Москва, МКАД",
        lastUpdate: "5 мин назад",
        score: 81,
        violations: 2,
        isOnline: false,
    },
    {
        id: 5,
        name: "Игорь Смирнов",
        avatar: "/placeholder.svg?height=40&width=40",
        vehicle: "BMW X5",
        plateNumber: "Е345КЛ77",
        style: "risky",
        speed: 95,
        location: "Москва, Кутузовский пр-т",
        lastUpdate: "1 мин назад",
        score: 65,
        violations: 5,
        isOnline: true,
    },
    {
        id: 6,
        name: "Анна Федорова",
        avatar: "/placeholder.svg?height=40&width=40",
        vehicle: "Hyundai Solaris",
        plateNumber: "Ж678МН77",
        style: "safe",
        speed: 60,
        location: "Москва, Арбат",
        lastUpdate: "3 мин назад",
        score: 92,
        violations: 0,
        isOnline: true,
    },
    ]

    const [searchTerm, setSearchTerm] = useState("")
    const [styleFilter, setStyleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredDrivers = drivers.filter((driver) => {
        const matchesSearch =
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStyle = styleFilter === "all" || driver.style === styleFilter
        const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "online" && driver.isOnline) ||
        (statusFilter === "offline" && !driver.isOnline)

        return matchesSearch && matchesStyle && matchesStatus
    })

    const onlineDrivers = drivers.filter((d) => d.isOnline).length
    const avgScore = Math.round(drivers.reduce((sum, d) => sum + d.score, 0) / drivers.length)
    const totalViolations = drivers.reduce((sum, d) => sum + d.violations, 0)

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
            <div className="col-md-3">
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
            </div>

            <div className="col-md-3">
                <div className="card h-100">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <p className="card-text text-muted small mb-1">Средний балл</p>
                        <h3 className="card-title mb-0">{avgScore}</h3>
                    </div>
                    <div className="text-success">
                        <i className="bi bi-graph-up fs-2"></i>
                    </div>
                    </div>
                </div>
                </div>
            </div>

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

            <div className="col-md-3">
                <div className="card h-100">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <p className="card-text text-muted small mb-1">Активные рейсы</p>
                        <h3 className="card-title mb-0">{drivers.length}</h3>
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

                <div className="col-md-3">
                    <select className="form-select" value={styleFilter} onChange={(e) => setStyleFilter(e.target.value)}>
                    <option value="all">Все стили</option>
                    <option value="safe">Безопасный</option>
                    <option value="aggressive">Агрессивный</option>
                    <option value="economical">Экономичный</option>
                    <option value="moderate">Умеренный</option>
                    <option value="risky">Рискованный</option>
                    </select>
                </div>

                <div className="col-md-3">
                    <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Все</option>
                    <option value="online">Онлайн</option>
                    <option value="offline">Офлайн</option>
                    </select>
                </div>
                </div>
            </div>
            </div>

            {/* Список водителей */}
            <div className="row g-4">
            {filteredDrivers.map((driver) => {
                const style = drivingStyles[driver.style as keyof typeof drivingStyles]

                return (
                <div key={driver.id} className="col-lg-6">
                    <div className="card h-100 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                            <div className="position-relative me-3">
                            <img
                                src={driver.avatar || "/placeholder.svg?height=48&width=48"}
                                alt={driver.name}
                                className="rounded-circle"
                                width="48"
                                height="48"
                            />
                            <span
                                className={`position-absolute bottom-0 end-0 p-1 rounded-circle border border-2 border-white ${
                                driver.isOnline ? "bg-success" : "bg-secondary"
                                }`}
                                style={{ width: "16px", height: "16px" }}
                            ></span>
                            </div>
                            <div>
                            <h6 className="card-title mb-1">{driver.name}</h6>
                            <p className="card-text text-muted small mb-0">{driver.vehicle}</p>
                            <p className="card-text text-muted small">{driver.plateNumber}</p>
                            </div>
                        </div>

                        <span className={`badge bg-${style.color}`}>{style.label}</span>
                        </div>

                        <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center text-muted small">
                            <i className="bi bi-speedometer2 me-2"></i>
                            <span>Скорость: {driver.speed} км/ч</span>
                            </div>
                            <div className="d-flex align-items-center small">
                            <span className="text-muted me-2">Балл:</span>
                            <span
                                className={`fw-bold ${
                                driver.score >= 90 ? "text-success" : driver.score >= 70 ? "text-warning" : "text-danger"
                                }`}
                            >
                                {driver.score}
                            </span>
                            </div>
                        </div>

                        <div className="d-flex align-items-center text-muted small mb-2">
                            <i className="bi bi-geo-alt me-2"></i>
                            <span className="text-truncate">{driver.location}</span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center text-muted small">
                            <i className="bi bi-clock me-2"></i>
                            <span>{driver.lastUpdate}</span>
                            </div>

                            <div className="d-flex align-items-center">
                            {driver.violations > 0 ? (
                                <div className="d-flex align-items-center text-danger">
                                <i className="bi bi-x-circle me-1"></i>
                                <span className="small">{driver.violations}</span>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center text-success">
                                <i className="bi bi-check-circle me-1"></i>
                                <span className="small">0</span>
                                </div>
                            )}
                            </div>
                        </div>
                        </div>

                        <div className="border-top pt-3">
                            <div className="row g-2">
                                <button className="btn btn-outline-primary btn-sm w-100">
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

            {filteredDrivers.length === 0 && (
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