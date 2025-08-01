"use client"

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import requestsToTheServer from "../../../components/requests_to_the_server";
import "./modal_window_edit_profile.css";


export default function EditProfileForm({ isOpen, onClose, userData }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        ...{ password: "", confirmPassword: "", currentPassword: "" },
        ...userData,
    });

    useEffect(() => {
        setFormData({
            ...{ password: "", confirmPassword: "", currentPassword: "" },
            ...userData,
        });
    }, [isOpen]);

    const onChange = (e) => {
        setErrors({})
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name == "phone" ? formatPhone(value) : value,
        });
    };

    function formatPhone(newValue: string) {
        let value = newValue.replace(/\D/g, "");
        if (value.startsWith("7")) value = value.substring(1);
        if (value.startsWith("8")) value = value.substring(1);

        let formatted = "+7";
        if (value.length > 0) formatted += " (" + value.substring(0, 3);
        if (value.length >= 4) formatted += ") " + value.substring(3, 6);
        if (value.length >= 7) formatted += "-" + value.substring(6, 8);
        if (value.length >= 9) formatted += "-" + value.substring(8, 10);

        return formatted;
    }

    function formDataToMap(formData) {
        const map = new Object();
        for (const [key, value] of formData.entries()) {
            if ( value !== userData[key] ) {
                map[key] = value;
            }
        }
        return map;
    }

    const [errors, setErrors] = useState<{
        password?: string;
        confirmPassword?: string;
        currentPassword?: string;
    }>({});
    const validate = () => {
        const newErrors: typeof errors = {};
        if (!formData.password && !formData.confirmPassword && !formData.currentPassword) {
            return newErrors;
        }
        if (!formData.password) {
            newErrors.password = "Введите новый пароль или оставьте поля для паролей пустыми";
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Подтвердите пароль";
        }
        if (formData.password && formData.confirmPassword
            && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают";
        }
        return newErrors;
    }

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const url = 'http://localhost:7000/update/user';
        const fd = new FormData(event.currentTarget);
        let data: Object = formDataToMap(fd);
        if ( data["password"] === "" ) {
            delete data["password"];
        }
        delete data["confirmPassword"];
        data["id"] = userData["id"];

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }


        const updateUserResult = await requestsToTheServer(url, 'PUT', JSON.stringify(data));
        const alertBlock = document.createElement("div");
        let message = "";
        let classIcon = "";
        let mainBlock = document.getElementById("mainBlock");
        if ( updateUserResult.ok ) {
            message = "Данные успешно обновлены.";
            classIcon = "bi-check-circle";
            alertBlock.className = "alert alert-success";
            router.refresh();
            onClose();
        }
        else {
            mainBlock = document.getElementById("editProfileModal");
            if ( updateUserResult.data["error"] !== undefined ) {
                message = updateUserResult.data["error"];
            }
            else {
                message = "Произошла непредвиденная ошибка. Повторите попытку позже.";
            }
            classIcon = "bi-exclamation-octagon";
            alertBlock.className = "alert alert-danger";
        }
        alertBlock.role = "alert";
        alertBlock.innerHTML = [
            '<div class="d-flex align-items-center">',
            `   <i class="bi ${classIcon} fs-3" style="margin-right: 1rem;"></i>`,
                message,
            '</div>',
            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"/>',
        ].join('');
        mainBlock.prepend(alertBlock);
    }

    return (
    <div style={{ display: "block" }}
            className="modal show"
            id="editProfileModal"
            tabIndex={-1}
            aria-labelledby="editProfileModalLabel"
            aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form onSubmit={onSubmit} autoComplete="on" noValidate>
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="editProfileModalLabel">
                                    <i className="bi bi-person-circle me-2"></i>
                                    Редактирование профиля
                                </h1>
                                <button
                                type="button"
                                // data-bs-dismiss="modal"
                                onClick={onClose}
                                className="btn-close" aria-label="Закрыть"
                                />
                            </div>

                            <div className="modal-body">
                                    {/* Поле для имени */}
                                    <div className="mb-3">
                                        <label htmlFor="userName" className="form-label">
                                            <i className="bi bi-person me-2"></i>
                                            Имя
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="userName"
                                            name="full_name"
                                            placeholder="Введите ваше имя"
                                            value={formData["full_name"]}
                                            onChange={onChange}
                                        />
                                    </div>

                                    {/* Поле для email */}
                                    <div className="mb-3">
                                        <label htmlFor="userEmail" className="form-label">
                                            <i className="bi bi-envelope me-2"></i>
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="userEmail"
                                            name="username"
                                            placeholder="Введите ваш email"
                                            value={formData["username"]}
                                            onChange={onChange}
                                        />
                                    </div>

                                    {/* Поле для телефона */}
                                    <div className="mb-3">
                                        <label htmlFor="userPhone" className="form-label">
                                            <i className="bi bi-telephone me-2"></i>
                                            Контактный телефон
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-phone"></i>
                                            </span>
                                            <input
                                            type="tel"
                                            className="form-control"
                                            id="userPhone"
                                            name="phone"
                                            placeholder="+7 (999) 999-99-99"
                                            value={formData["phone"]}
                                            onChange={onChange}
                                            maxLength={18}
                                            />
                                            <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => setFormData({ ...formData, phone: "+7 (" })}
                                            title="Очистить номер"
                                            >
                                                <i className="bi bi-arrow-clockwise"></i>
                                            </button>
                                        </div>
                                        <div className="form-text">
                                            <i className="bi bi-info-circle me-1"></i>
                                            Формат: +7 (999) 999-99-99
                                        </div>
                                    </div>

                                    {/* Поле для адреса */}
                                    <div className="mb-3">
                                        <label htmlFor="userAddress" className="form-label">
                                            <i className="bi bi-geo-alt me-2"></i>
                                            Адрес
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-house-door"></i>
                                            </span>
                                            <textarea
                                            className="form-control"
                                            id="userAddress"
                                            name="address"
                                            rows={3}
                                            placeholder="Введите ваш адрес"
                                            value={formData["address"]}
                                            onChange={onChange}
                                            style={{ resize: "vertical" }}
                                            />
                                        </div>
                                        <div className="form-text">
                                            <i className="bi bi-info-circle me-1"></i>
                                            Укажите полный адрес с городом, улицей и номером дома
                                        </div>
                                    </div>

                                    {/* Поле для старого пароля */}
                                    <div className="mb-3">
                                        <label htmlFor="userPassword" className="form-label">
                                            <i className="bi bi-lock me-2"></i>
                                            Текуший пароль
                                        </label>
                                        <div className="input-group">
                                            <input
                                            type="password"
                                            className={`form-control ${errors.currentPassword ? "is-invalid" : ""}`}
                                            id="userCurrentPassword"
                                            name="currentPassword"
                                            placeholder="Введите текущий пароль"
                                            onChange={onChange}
                                            />
                                            <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={(e) => {
                                                const input = document.getElementById("userCurrentPassword") as HTMLInputElement
                                                const icon = e.currentTarget.querySelector("i")
                                                if (input.type === "password") {
                                                input.type = "text"
                                                icon!.className = "bi bi-eye-slash"
                                                } else {
                                                input.type = "password"
                                                icon!.className = "bi bi-eye"
                                                }
                                            }}
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                        </div>
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                        <div className="form-text">Оставьте пустым, если не хотите менять пароль</div>
                                    </div>

                                    {/* Поле для пароля */}
                                    <div className="mb-3">
                                        <label htmlFor="userPassword" className="form-label">
                                            <i className="bi bi-lock me-2"></i>
                                            Новый пароль
                                        </label>
                                        <div className="input-group">
                                            <input
                                            type="password"
                                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                            id="userPassword"
                                            name="password"
                                            placeholder="Введите новый пароль"
                                            onChange={onChange}
                                            />
                                            <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={(e) => {
                                                const input = document.getElementById("userPassword") as HTMLInputElement
                                                const icon = e.currentTarget.querySelector("i")
                                                if (input.type === "password") {
                                                input.type = "text"
                                                icon!.className = "bi bi-eye-slash"
                                                } else {
                                                input.type = "password"
                                                icon!.className = "bi bi-eye"
                                                }
                                            }}
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                        </div>
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                        <div className="form-text">Оставьте пустым, если не хотите менять пароль</div>
                                    </div>

                                    {/* Подтверждение пароля */}
                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            <i className="bi bi-lock-fill me-2"></i>
                                            Подтвердите пароль
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="password"
                                                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                placeholder="Подтвердите новый пароль"
                                                onChange={onChange}
                                                required={!!formData.password}
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={(e) => {
                                                    const input = document.getElementById("confirmPassword") as HTMLInputElement
                                                    const icon = e.currentTarget.querySelector("i")
                                                    if (input.type === "password") {
                                                    input.type = "text"
                                                    icon!.className = "bi bi-eye-slash"
                                                    } else {
                                                    input.type = "password"
                                                    icon!.className = "bi bi-eye"
                                                    }
                                                }}
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                    </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={onClose} className="btn btn-secondary">
                                    {/* data-bs-dismiss="modal" */}
                                    <i className="bi bi-x-circle me-2"></i>
                                    Отмена
                                </button>
                                <button type="submit" className="btn btn-success">
                                    {/*  data-bs-dismiss="modal" */}
                                    <i className="bi bi-check-circle me-2"></i>
                                    Сохранить изменения
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
    </div>
    );
}