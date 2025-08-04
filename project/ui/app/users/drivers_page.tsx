"use client"
import { useState } from "react";
import { Driver, DriversData } from "../../models/driver";
import { Role, User } from "../../models/user";
import { useUser } from "../user_context";

export default function DriversInfoPage({ data }: { data: DriversData; }) {
    const owner: User = useUser();
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const { drivers, bestDriver, worstDriver, averageDrivers } = data;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        });
    };

    const getDriverInitials = (fullName: string) => {
        return fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .substring(0, 2);
    };

    const getDriverType = (driver: Driver) => {
        if (driver.id === bestDriver?.id) return "best";
        if (driver.id === worstDriver?.id) return "worst";
        return "average";
    };

    const getDriverTypeLabel = (type: string) => {
        switch (type) {
        case "best":
            return { label: "Лучший", class: "bg-success", icon: "bi-trophy" };
        case "worst":
            return { label: "Требуют внимания", class: "bg-warning", icon: "bi-exclamation-triangle" };
        default:
            return { label: "Добросовестные", class: "bg-primary", icon: "bi-person-check" };
        };
    };

    const isLicenseExpiringSoon = (expirationDate: string) => {
        const expDate = new Date(expirationDate);
        const today = new Date();
        const monthsUntilExpiry = (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
        return monthsUntilExpiry <= 6;
    };

    const filteredDrivers = drivers.filter((driver) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
        !query ||
        driver.full_name.toLowerCase().includes(query) ||
        driver.phone.includes(query) ||
        driver.email.toLowerCase().includes(query) ||
        driver.license_number.includes(query);

        if (selectedFilter === "all") return matchesSearch;
        if (selectedFilter === "best") return matchesSearch && driver.id === bestDriver?.id;
        if (selectedFilter === "worst") return matchesSearch && driver.id === worstDriver?.id;
        if (selectedFilter === "average") return matchesSearch && averageDrivers.some((d) => d.id === driver.id);
        if (selectedFilter === "expiring") return matchesSearch && isLicenseExpiringSoon(driver.expiration_driver_license);

        return matchesSearch;
    });

    const clearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div className="container py-4">
        {/* Header */}
        <div className="row mb-4">
            <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                <h1 className="display-6 fw-bold mb-2">
                    <i className="bi bi-people text-primary me-3"></i>
                    Водители
                </h1>
                <p className="text-muted">Управление водителями автопарка</p>
                </div>
                {
                    owner.role === Role.USER ?
                        <button className="btn btn-primary">
                            <i className="bi bi-person-plus me-2"></i>
                            Добавить водителя
                        </button>
                    :
                    <></>
                }
            </div>
            </div>
        </div>

        {/* Search and Filters */}
        <div className="row mb-4">
            <div className="col-md-8">
            <div className="btn-group" role="group">
                <button
                type="button"
                className={`btn ${selectedFilter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setSelectedFilter("all")}
                >
                <i className="bi bi-list me-1"></i>
                Все ({drivers.length})
                </button>
                <button
                type="button"
                className={`btn ${selectedFilter === "best" ? "btn-success" : "btn-outline-success"}`}
                onClick={() => setSelectedFilter("best")}
                >
                <i className="bi bi-trophy me-1"></i>
                Лучший
                </button>
                <button
                type="button"
                className={`btn ${selectedFilter === "average" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setSelectedFilter("average")}
                >
                <i className="bi bi-person-check me-1"></i>
                Добросовестные ({averageDrivers.length})
                </button>
                <button
                type="button"
                className={`btn ${selectedFilter === "worst" ? "btn-warning" : "btn-outline-warning"}`}
                onClick={() => setSelectedFilter("worst")}
                >
                <i className="bi bi-exclamation-triangle me-1"></i>
                Требуют внимания
                </button>
                <button
                type="button"
                className={`btn ${selectedFilter === "expiring" ? "btn-info" : "btn-outline-info"}`}
                onClick={() => setSelectedFilter("expiring")}
                >
                <i className="bi bi-card-text me-1"></i>
                Истекают права ({drivers.filter((d) => isLicenseExpiringSoon(d.expiration_driver_license)).length})
                </button>
            </div>
            </div>
            <div className="col-md-4">
            <div className="position-relative">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input
                type="text"
                className="form-control ps-5"
                placeholder="Поиск по имени, телефону, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                <button
                    type="button"
                    className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
                    onClick={clearSearch}
                    style={{ border: "none", background: "none" }}
                >
                    <i className="bi bi-x-lg text-muted"></i>
                </button>
                )}
            </div>
            </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
            <div className="mb-3">
            <small className="text-muted">
                {filteredDrivers.length === 0
                ? `Не найдено водителей по запросу "${searchQuery}"`
                : `Найдено ${filteredDrivers.length} из ${drivers.length} водителей`}
            </small>
            </div>
        )}

        {/* Drivers Grid */}
        {filteredDrivers.length === 0 ? (
            <div className="text-center py-5">
            <i className="bi bi-search text-muted" style={{ fontSize: "3rem" }}></i>
            <h4 className="mt-3 mb-2">Водители не найдены</h4>
            <p className="text-muted">Попробуйте изменить параметры поиска или фильтры</p>
            {searchQuery && (
                <button className="btn btn-outline-primary" onClick={clearSearch}>
                Очистить поиск
                </button>
            )}
            </div>
        ) : (
            <div className="row g-4">
            {filteredDrivers.map((driver) => {
                const driverType = getDriverType(driver)
                const typeInfo = getDriverTypeLabel(driverType)
                const isExpiring = isLicenseExpiringSoon(driver.expiration_driver_license)

                return (
                <div key={driver.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white me-3"
                            style={{
                            width: "40px",
                            height: "40px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                        >
                            <strong>{getDriverInitials(driver.full_name)}</strong>
                        </div>
                        <div>
                            <h6 className="mb-0">{driver.full_name}</h6>
                            <small className="text-muted">Стаж: {driver.driving_experience} лет</small>
                        </div>
                        </div>
                        <span className={`badge ${typeInfo.class} d-flex align-items-center gap-1`}>
                        <i className={`bi ${typeInfo.icon}`}></i>
                        {typeInfo.label}
                        </span>
                    </div>
                    <div className="card-body">
                        {/* Contact Info */}
                        <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-telephone text-muted me-2"></i>
                            <small>{driver.phone}</small>
                        </div>
                        <div className="d-flex align-items-center">
                            <i className="bi bi-envelope text-muted me-2"></i>
                            <small>{driver.email}</small>
                        </div>
                        </div>

                        {/* License Info */}
                        <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted">Номер прав:</small>
                            <code className="small">{driver.license_number}</code>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">Действительны до:</small>
                            <small className={isExpiring ? "text-danger fw-bold" : ""}>
                            {formatDate(driver.expiration_driver_license)}
                            {isExpiring && <i className="bi bi-exclamation-triangle ms-1"></i>}
                            </small>
                        </div>
                        </div>

                        {/* Stats */}
                        <div className="row g-2 text-center">
                        <div className="col-4">
                            <div className="border rounded p-2">
                            <div className="d-flex align-items-center justify-content-center mb-1">
                                <i className="bi bi-star-fill text-warning me-1"></i>
                                <strong>{driver.driving_rating}</strong>
                            </div>
                            <small className="text-muted">Рейтинг</small>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="border rounded p-2">
                            <div className="d-flex align-items-center justify-content-center mb-1">
                                <i className="bi bi-exclamation-triangle text-danger me-1"></i>
                                <strong>{driver.number_violations}</strong>
                            </div>
                            <small className="text-muted">Нарушения</small>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="border rounded p-2">
                            <div className="d-flex align-items-center justify-content-center mb-1">
                                <i className="bi bi-clock text-info me-1"></i>
                                <strong>{driver.driving_experience}</strong>
                            </div>
                            <small className="text-muted">Лет</small>
                            </div>
                        </div>
                        </div>
                    </div>
                    {
                        owner.role === Role.USER ?
                        <div className="card-footer bg-transparent">
                            <div className="d-flex gap-2">
                            <button className="btn btn-outline-secondary btn-sm flex-fill">
                                <i className="bi bi-pencil me-1"></i>
                                Редактировать
                            </button>
                            </div>
                        </div>
                        :
                        <></>
                    }
                    </div>
                </div>
                )
            })}
            </div>
        )}
        </div>
    );
}
