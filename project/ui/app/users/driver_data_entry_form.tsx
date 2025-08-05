"use client"
import { FormEvent, useEffect, useState } from "react";
import requestsToTheServer from "../../components/requests_to_the_server";
import { useRouter } from "next/navigation";
import { Driver } from "../../models/driver";

function getInitialData( typeForm: string, driverData: Driver) {
    console.log(typeForm);
    console.log(driverData);
    return typeForm === "add" ?
        {
            license_number: "",
            expiration_driver_license: "",
            full_name: "",
            phone: "",
            email: "",
            driving_experience: "",
            issue_date: "",
        } :
        {
            license_number: driverData.license_number,
            expiration_driver_license: driverData.expiration_driver_license,
            full_name: driverData.full_name,
            phone: driverData.phone,
            email: driverData.email,
            driving_experience: driverData.driving_experience,
            issue_date: driverData.issue_date,
        };
}

interface DriverFormModalProps {
    isOpen: boolean
    onClose: (typeForm: string, driver: Driver | null) => void
    userData: number
    typeForm: string
    driverData?: Driver
}

export default function DriverDataEntryForm({ isOpen, onClose, userData, typeForm, driverData }: DriverFormModalProps) {
    const router = useRouter();
    const [formData, setFormData] = useState( getInitialData(typeForm, driverData) );
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setFormData( getInitialData(typeForm, driverData) );
    }, [isOpen]);

    const onChange = (e) => {
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

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        const url = "http://localhost:7000" +
        (typeForm === "edit" ? "/update" : "/add") + "/driver";
        const typeMethod = (typeForm === "edit" ? "PUT" : "POST");
        const fd = new FormData(event.currentTarget);
        let data: Object = formDataToMap(fd);
        data["director_id"] = userData;
        if ( typeForm === "edit" ) data["id"] = driverData.id;

        const updateDriverResult = await requestsToTheServer(url, typeMethod, JSON.stringify(data));
        console.log(updateDriverResult);
        const alertBlock = document.createElement("div");
        alertBlock.id = "messageAlert"
        let message = "";
        let classIcon = "";
        const mainBlock = document.getElementById("driverFormModal");
        if ( updateDriverResult.ok ) {
            message = typeForm === "edit" ? "Данные водителя успешно обновлены." : "Водитель успешно добавлен в систему.";
            classIcon = "bi-check-circle";
            alertBlock.className = "alert alert-success";
            router.refresh();
            onClose(typeForm, driverData ? driverData : null);
        }
        else {
            if ( updateDriverResult.data["error"] !== undefined ) {
                message = updateDriverResult.data["error"];
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
        if (mainBlock) {
            const existingAlerts = mainBlock.querySelectorAll(".alert");
            existingAlerts.forEach((alert) => alert.remove());
            const modalBody = mainBlock.querySelector(".modal-body");
            if (modalBody) modalBody.prepend(alertBlock);
        }
        setIsSubmitting(false);
    }

    const modalTitle = typeForm === "edit" ? "Редактировать водителя" : "Добавить водителя"
    const submitButtonText = typeForm === "edit" ? "Сохранить изменения" : "Добавить водителя"

    return (
        <div className="modal" tabIndex={-1} style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title d-flex align-items-center">
                        <i className={`bi ${typeForm === "edit" ? "bi-pencil-square" : "bi-person-plus"} text-primary me-2`}></i>
                        {modalTitle}
                        </h5>
                        <button
                                type="button"
                                className="btn-close"
                                onClick={ () => onClose(typeForm, driverData ? driverData : null)}
                                aria-label="Close"
                                disabled={isSubmitting}
                        ></button>
                    </div>

                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            {/* Персональные данные */}
                            <div className="mb-4">
                                <h6 className="text-muted mb-3 d-flex align-items-center">
                                    <i className="bi bi-person text-primary me-2"></i>
                                    Персональные данные
                                </h6>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label htmlFor="full_name" className="form-label">
                                            <i className="bi bi-person me-1"></i>
                                            Полное имя <span className="text-danger">*</span>
                                        </label>
                                        <input
                                                type="text"
                                                className="form-control"
                                                id="full_name"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={onChange}
                                                placeholder="Иванов Иван Иванович"
                                                required
                                                disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="phone" className="form-label">
                                            <i className="bi bi-telephone me-1"></i>
                                            Телефон <span className="text-danger">*</span>
                                        </label>
                                        <input
                                                type="tel"
                                                className="form-control"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={onChange}
                                                placeholder="+7 (999) 123-45-67"
                                                required
                                                disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="email" className="form-label">
                                            <i className="bi bi-envelope me-1"></i>
                                            Email <span className="text-danger">*</span>
                                        </label>
                                        <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={onChange}
                                                placeholder="example@mail.com"
                                                required
                                                disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Данные водителя */}
                            <div className="mb-4">
                                <h6 className="text-muted mb-3 d-flex align-items-center">
                                    <i className="bi bi-card-text text-primary me-2"></i>
                                    Данные водителя
                                </h6>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="license_number" className="form-label">
                                            <i className="bi bi-credit-card me-1"></i>
                                            Номер водительского удостоверения <span className="text-danger">*</span>
                                        </label>
                                        <input
                                                type="text"
                                                className="form-control"
                                                id="license_number"
                                                name="license_number"
                                                value={formData.license_number}
                                                onChange={onChange}
                                                placeholder="7712 345678"
                                                required
                                                disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="driving_experience" className="form-label">
                                            <i className="bi bi-clock me-1"></i>
                                            Стаж вождения (лет) <span className="text-danger">*</span>
                                        </label>
                                        <input
                                                type="number"
                                                className="form-control"
                                                id="driving_experience"
                                                name="driving_experience"
                                                value={formData.driving_experience}
                                                onChange={onChange}
                                                placeholder="5"
                                                min="0"
                                                max="50"
                                                required
                                                disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="issue_date" className="form-label">
                                            <i className="bi bi-calendar-plus me-1"></i>
                                            Дата выдачи прав <span className="text-danger">*</span>
                                        </label>
                                        <input
                                                type="date"
                                                className="form-control"
                                                id="issue_date"
                                                name="issue_date"
                                                value={formData.issue_date}
                                                onChange={onChange}
                                                required
                                                disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="expiration_driver_license" className="form-label">
                                            <i className="bi bi-calendar-x me-1"></i>
                                            Срок действия прав <span className="text-danger">*</span>
                                        </label>
                                        <input
                                                type="date"
                                                className="form-control"
                                                id="expiration_driver_license"
                                                name="expiration_driver_license"
                                                value={formData.expiration_driver_license}
                                                onChange={onChange}
                                                required
                                                disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Информационное сообщение */}
                            <div className="alert alert-info d-flex align-items-center" role="alert">
                                <i className="bi bi-info-circle me-2"></i>
                                <small>
                                    Поля, отмеченные <span className="text-danger">*</span>, обязательны для заполнения.
                                    {typeForm === "edit" && " Изменяйте только те поля, которые необходимо обновить."}
                                </small>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={ () => onClose(typeForm, driverData ? driverData : null) }
                                    disabled={isSubmitting}>
                                <i className="bi bi-x-circle me-1"></i>
                                Отмена
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Сохранение...
                                </>
                                ) : (
                                <>
                                    <i className={`bi ${typeForm === "edit" ? "bi-check-lg" : "bi-plus-circle"} me-1`}></i>
                                    {submitButtonText}
                                </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}