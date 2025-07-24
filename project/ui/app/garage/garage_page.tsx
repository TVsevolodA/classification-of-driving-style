"use client"

import type React from "react";
import { useState } from "react";
import "./page.css";
import { useUser } from "../user_context";
import requestsToTheServer from "../../components/requests_to_the_server";

interface CarType {
    vin: string
    owner: string
    brand: string
    model: string
    year: number
    licensePlate: string
    mileage: number
}

enum TypeMessage {
    Error,
    Success
}

function addMessage(message: string, typeMessage: TypeMessage) {
    const alertBlock = document.createElement("div");
    let classIcon = "";
    if (typeMessage == TypeMessage.Success) {
        alertBlock.className = "alert alert-success";
        classIcon = "bi-check-circle";
    }
    else {
        alertBlock.className = "alert alert-danger";
        classIcon = "bi-exclamation-octagon";
    }
    alertBlock.role = "alert";
    alertBlock.innerHTML = [
        '<div class="d-flex align-items-center">',
        `   <i class="bi ${classIcon} fs-3" style="margin-right: 1rem;"></i>`,
            message,
        '</div>',
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"/>',
    ].join('');
    const mainBlock = document.getElementById("mainBlock");
    mainBlock.prepend(alertBlock);
}

async function contactServer(requestUrl: string, typeRequest: string, dataForRequest: string) {
    const result = await requestsToTheServer(
        requestUrl,
        typeRequest,
        dataForRequest
    );
    let successMessage: string = "";
    let errorMessage: string = "";
    if ( result.ok ) {
        if ( result.statusCode === 204 ) successMessage = "Автомобиль успешно удален.";
        else successMessage = result.data["message"];
        addMessage(successMessage, TypeMessage.Success);
    }
    else {
        if ( result.error !== null ) errorMessage = result.error;
        else errorMessage = JSON.stringify(result.data);
        addMessage(errorMessage, TypeMessage.Error);
    }
}

export default function CarManagement({ userСars }: { userСars: CarType[]; }) {
    let url = "http://localhost:7000";
    const [cars, setCars] = useState<CarType[]>(userСars);
    const user = useUser();

    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<CarType | null>(null);
    const [carToDelete, setCarToDelete] = useState<CarType | null>(null);
    const [formData, setFormData] = useState({
        vin: "",
        owner: user["username"],
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        licensePlate: "",
        mileage: 0,
    });

    const resetForm = () => {
        setFormData({
            vin: "",
            owner: user["username"],
            brand: "",
            model: "",
            year: new Date().getFullYear(),
            licensePlate: "",
            mileage: 0,
        });
        setEditingCar(null);
    };

    const openAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (car: CarType) => {
        setFormData({
            vin: car.vin,
            owner: user["username"],
            brand: car.brand,
            model: car.model,
            year: car.year,
            licensePlate: car.licensePlate,
            mileage: car.mileage,
        });
        setEditingCar(car);
        setIsModalOpen(true);
    };

    const openDeleteModal = (car: CarType) => {
        setCarToDelete(car);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCar) {
            // Изменение данных об автомобиле
            setCars(
                cars.map(
                    (car) => (car.vin === editingCar.vin ? { ...car, ...formData } : car)
                )
            );
            url += "/update/car";
            await contactServer(url, "PUT", JSON.stringify(formData));
        }
        else {
            // Добавление автомобиля в базу
            const newCar: CarType = {
                owner: user["username"],
                ...formData,
            };
            setCars([...cars, newCar]);
            url += "/add/car";
            await contactServer(url, "POST", JSON.stringify(formData));
        }
        setIsModalOpen(false);
        resetForm();
    };

    const confirmDelete = async () => {
        if (carToDelete) {
            url += "/delete/car";
            await contactServer(url, "DELETE", JSON.stringify(carToDelete));
            setCars(cars.filter((car) => car.vin !== carToDelete.vin));
            setIsDeleteModalOpen(false);
            setCarToDelete(null);
        }
    };

    const formatMileage = (mileage: number) => {
        return new Intl.NumberFormat("ru-RU").format(mileage);
    };
    
    const filteredCars = cars.filter((car) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        return (
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.licensePlate.toLowerCase().includes(query)
        );
    });

    const clearSearch = () => {
        setSearchQuery("");
    };

    return (
    <div id="mainBlock" className="container py-4">
        {/* Заголовок */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <div>
                {user["role"] === "admin" ?
                <>
                    <h1 className="display-5 fw-bold mb-2">Список транспортных средств</h1>
                </>
                :
                <>
                    <h1 className="display-5 fw-bold mb-2">Мои автомобили</h1>
                    <p className="text-muted">Управляйте своим автопарком</p>
                </>
                }
            </div>
            { user["role"] === "admin" ? <></> :
                <>
                    <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={openAddModal}
                    >
                        <i className="bi bi-plus-circle"></i>
                        Добавить автомобиль
                    </button>
                </>
            }
        </div>

        {/* Фильтрция авто */}
        <div className="search-container mb-4" style={{ width: "100%" }}>
            <i className="bi bi-search search-icon"></i>
            <input
            type="text"
            className="form-control search-input"
            placeholder="Поиск по бренду, модели или номеру..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
            <button type="button" className="search-clear" onClick={clearSearch} title="Очистить поиск">
                <i className="bi bi-x-lg"></i>
            </button>
            )}
        </div>

        {/* Автопарк */}
        {filteredCars.length === 0 ? (
                <div className="empty-state">
                {searchQuery ? (
                    <>
                    <i className="bi bi-search car-icon d-block"></i>
                    <h3 className="mb-3">Ничего не найдено</h3>
                    <p className="mb-4">По запросу "{searchQuery}" автомобили не найдены</p>
                    <button className="btn btn-outline-primary me-2" onClick={clearSearch}>
                        Очистить поиск
                    </button>
                    <button className="btn btn-primary" onClick={openAddModal}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Добавить автомобиль
                    </button>
                    </>
                ) : (
                    <>
                    <i className="bi bi-car-front car-icon d-block"></i>
                    <h3 className="mb-3">Нет автомобилей</h3>
                    <p className="mb-4">Добавьте свой первый автомобиль, чтобы начать управление автопарком</p>
                    <button className="btn btn-primary" onClick={openAddModal}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Добавить автомобиль
                    </button>
                    </>
                )}
            </div>
        ) : (
        <div className="row g-4">
            {filteredCars.map((car) => (
            <div key={car.vin} className="col-md-6 col-lg-4">
                <div className="card car-card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-car-front text-primary"></i>
                    <h6 className="mb-0 fw-bold">
                        {car.brand} {car.model}
                    </h6>
                    </div>
                    <div className="btn-group" role="group">
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openEditModal(car)}
                        title="Редактировать"
                    >
                        <i className="bi bi-pencil"></i>
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openDeleteModal(car)}
                        title="Удалить"
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row g-3 mb-3">
                        <div>
                            <small className="text-muted">VIN номер</small>
                            <div className="license-plate mt-1">{car.vin}</div>
                        </div>
                        <div className="col-6">
                            <small className="text-muted">Год выпуска</small>
                            <div className="fw-semibold">{car.year}</div>
                        </div>
                        <div className="col-6">
                            <small className="text-muted">Пробег</small>
                            <div className="fw-semibold">{formatMileage(car.mileage)} км</div>
                        </div>
                    </div>
                    <div>
                        <small className="text-muted">Государственный номер</small>
                        <div className="license-plate mt-1">{car.licensePlate}</div>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
        )}

        {/* Добавление авто */}
        { isModalOpen && (
        <div className="modal fade show" tabIndex={-1} aria-hidden="true" style={{ display: "block" }}>
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">{editingCar ? "Редактировать автомобиль" : "Добавить автомобиль"}</h5>
                <button
                type="button"
                className="btn-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
                ></button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="modal-body">
                <div className="row g-3">
                    <div className="col-md-6">
                    <label htmlFor="brand" className="form-label">
                        Марка
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        placeholder="Toyota"
                        required
                    />
                    </div>
                    <div className="col-md-6">
                    <label htmlFor="model" className="form-label">
                        Модель
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="model"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        placeholder="Camry"
                        required
                    />
                    </div>
                    <div className="col-md-6">
                    <label htmlFor="year" className="form-label">
                        Год выпуска
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="year"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        required
                    />
                    </div>
                    <div className="col-md-6">
                    <label htmlFor="mileage" className="form-label">
                        Пробег (км)
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="mileage"
                        value={formData.mileage}
                        onChange={(e) => setFormData({ ...formData, mileage: Number.parseInt(e.target.value) })}
                        min="0"
                        required
                    />
                    </div>
                    <div className="col-12">
                        <label htmlFor="licensePlate" className="form-label">
                            Государственный номер
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="licensePlate"
                            value={formData.licensePlate}
                            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                            placeholder="А123БВ777"
                            required
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="vin" className="form-label">
                            VIN номер
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="vin"
                            minLength={17}
                            maxLength={17}
                            value={formData.vin}
                            onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                            placeholder="0ABCDE12F34G56789"
                            required
                            readOnly={editingCar && formData.vin.length === 17 ? true : false}
                            disabled={editingCar && formData.vin.length === 17 ? true : false}
                        />
                    </div>
                </div>
                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Отмена
                </button>
                <button type="submit" className="btn btn-primary">
                    {editingCar ? "Сохранить" : "Добавить"}
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
        )}

        {/* Удаление авто */}
        { isDeleteModalOpen && (
        <div className="modal fade show" tabIndex={-1} aria-hidden="true" style={{ display: "block" }}>
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Удалить автомобиль?</h5>
                <button
                type="button"
                className="btn-close"
                onClick={() => setIsDeleteModalOpen(false)}
                aria-label="Close"
                ></button>
            </div>
            <div className="modal-body">
                <p>
                Вы уверены, что хотите удалить {carToDelete?.brand} {carToDelete?.model}? Это действие нельзя отменить.
                </p>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Отмена
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                Удалить
                </button>
            </div>
            </div>
        </div>
        </div>
        )}
    </div>
    );
}