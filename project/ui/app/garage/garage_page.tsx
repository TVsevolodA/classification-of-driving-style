"use client"

import type React from "react";
import { useState } from "react";
import "./page.css";
import { useUser } from "../user_context";

interface CarType {
    owner: string
    brand: string
    model: string
    year: number
    licensePlate: string
    mileage: number
}

export default function CarManagement({ userСars }: { userСars: CarType[]; }) {
    const [cars, setCars] = useState<CarType[]>(userСars);
    const user = useUser();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<CarType | null>(null);
    const [carToDelete, setCarToDelete] = useState<CarType | null>(null);
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        licensePlate: "",
        mileage: 0,
    });

    const resetForm = () => {
        setFormData({
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCar) {
            setCars(
                cars.map(
                    (car) => (car.licensePlate === editingCar.licensePlate ? { ...car, ...formData } : car)
                )
            );
            // TODO: запрос на сервер для изменения
        }
        else {
            const newCar: CarType = {
                owner: user["username"],
                ...formData,
            };
            setCars([...cars, newCar]);
            // TODO: запрос на сервер для добавления
        }
        setIsModalOpen(false);
        resetForm();
    };

    const confirmDelete = () => {
        if (carToDelete) {
            setCars(cars.filter((car) => car.licensePlate !== carToDelete.licensePlate));
            setIsDeleteModalOpen(false);
            setCarToDelete(null);
            // TODO: запрос на сервер для удаления
        }
    };

    const formatMileage = (mileage: number) => {
        return new Intl.NumberFormat("ru-RU").format(mileage);
    }

    return (
    <div className="container py-4">
        {/* Заголовок */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <div>
                <h1 className="display-5 fw-bold mb-2">Мои автомобили</h1>
                <p className="text-muted">Управляйте своим автопарком</p>
            </div>
            <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={openAddModal}
            >
                <i className="bi bi-plus-circle"></i>
                Добавить автомобиль
            </button>
        </div>

        {/* Cars Grid */}
        {cars.length === 0 ? (
        <div className="empty-state">
            <i className="bi bi-car-front car-icon d-block"></i>
            <h3 className="mb-3">Нет автомобилей</h3>
            <p className="mb-4">Добавьте свой первый автомобиль, чтобы начать управление автопарком</p>
            <button className="btn btn-primary" onClick={openAddModal}>
            <i className="bi bi-plus-circle me-2"></i>
            Добавить автомобиль
            </button>
        </div>
        ) : (
        <div className="row g-4">
            {cars.map((car) => (
            <div key={car.licensePlate} className="col-md-6 col-lg-4">
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