"use client";
import { useRouter } from "next/navigation";

export default function Component() {
    const router = useRouter();
    const personalData = {
        pathProfilePhoto: "/",
        full_name: "Александр Иванов",
        email: "a.ivanov@email.com",
        phone: "+7 (999) 123-45-67",
        address: "Москва, Россия",
    };
    const drivingData = {
        rating: 8.7,
        experience: 12,
        safeDriving: 92,
        
    };
    const carData = {
        makeAndModel: "Toyota Camry",
        yearRelease: 2021,
        stateNumber: "А123БВ77",
        mileage: 78.450,
    };

    const logOut = async () => {
        const url = 'http://localhost:7000/logout';
        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            console.log('Пользователь успешно вышел из системы.', response.status);
            if ( response.ok ) {
                router.push('/');
            }
        } catch (error) {
            console.error('Произошла ошибка привыходе из системы:', error);
        }
    }

    return (
    <div className="min-vh-100" style={{ background: "linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)" }}>
        <div className="container py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="display-5 fw-bold text-dark mb-0">Личный профиль</h1>
                <button className="btn btn-outline-primary d-flex align-items-center gap-2"
                onClick={logOut}
                >
                    <i className="bi bi-box-arrow-left"></i>
                    Выйти
                </button>
            </div>

            {/* User Info Card */}
            <div className="card mb-4 border-0 shadow-sm overflow-hidden">
                <div
                    className="card-header p-4"
                    style={{ background: "linear-gradient(135deg, #1976d2 0%, #3f51b5 100%)", color: "white" }}
                >
                    <div className="row align-items-center">
                        <div className="col-auto">
                            <div className="position-relative">
                                <img
                                    src={personalData.pathProfilePhoto}
                                    alt="Фото профиля"
                                    className="rounded-circle border border-4 border-white"
                                />
                            </div>
                        </div>
                        <div className="col">
                            <h2 className="h3 fw-bold mb-3">{personalData.full_name}</h2>
                            <div className="row g-3 text-light">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-envelope"></i>
                                        <span>{personalData.email}</span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-telephone"></i>
                                        <span>{personalData.phone}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-2 mt-2 text-light">
                                <i className="bi bi-geo-alt"></i>
                                <span>{personalData.address}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Button */}
            <div className="text-center mb-4">
                <button className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2 mx-auto px-4">
                <i className="bi bi-pencil-square"></i>
                Редактировать профиль
                </button>
            </div>

            <div className="row g-4">
                {/* Driver Stats */}
                <div className="col-lg-6">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header bg-white border-bottom">
                            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                            <i className="bi bi-person text-primary"></i>
                            Данные водителя
                            </h5>
                            <small className="text-muted">Статистика и рейтинг вождения</small>
                        </div>
                        <div className="card-body">
                            <div className="row g-3 mb-4">
                                <div className="col-6">
                                    <div className="text-center p-3 bg-primary bg-opacity-10 rounded">
                                    <div className="h2 fw-bold text-primary mb-1">{drivingData.rating}</div>
                                    <div className="small text-muted">Рейтинг</div>
                                    <div className="mt-2">
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star text-muted"></i>
                                    </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-center p-3 bg-success bg-opacity-10 rounded">
                                    <div className="h2 fw-bold text-success mb-1">{drivingData.experience}</div>
                                    <div className="small text-muted">Стаж</div>
                                    <div className="mt-2">
                                        <i className="bi bi-calendar text-success"></i>
                                    </div>
                                    </div>
                                </div>
                            </div>

                            <hr />

                            <div className="mb-4">
                                <div className="d-flex justify-content-between small mb-2">
                                    <span>Безопасность вождения</span>
                                    <span className="fw-medium">{drivingData.safeDriving}%</span>
                                </div>
                                <div className="progress" style={{ height: "8px" }}>
                                    <div className="progress-bar bg-success" style={{ width: "92%" }}></div>
                                </div>
                            </div>

                            {/* <hr />

                            <div className="row text-center g-3">
                            <div className="col-4">
                                <div className="h5 fw-semibold text-dark mb-0">45,230</div>
                                <div className="small text-muted">км пройдено</div>
                            </div>
                            <div className="col-4">
                                <div className="h5 fw-semibold text-dark mb-0">127</div>
                                <div className="small text-muted">поездок</div>
                            </div>
                            <div className="col-4">
                                <div className="h5 fw-semibold text-dark mb-0">3</div>
                                <div className="small text-muted">нарушения</div>
                            </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Vehicle Info */}
                <div className="col-lg-6">
                    <div className="card h-100 border-0 shadow-sm">
                    <div className="card-header bg-white border-bottom">
                        <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                        <i className="bi bi-car-front text-primary"></i>
                        Транспортное средство
                        </h5>
                        <small className="text-muted">Информация о вашем автомобиле</small>
                    </div>
                    <div className="card-body">
                        <div className="d-flex align-items-center gap-3 p-3 bg-light rounded mb-4">
                        <div
                            className="bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center"
                            style={{ width: "64px", height: "64px" }}
                        >
                            <i className="bi bi-car-front text-primary fs-3"></i>
                        </div>
                        <div className="flex-grow-1">
                            <h6 className="fw-semibold mb-1">{carData.makeAndModel}</h6>
                            <p className="text-muted mb-2">{carData.yearRelease} год выпуска</p>
                        </div>
                        </div>

                        <div className="row g-3 mb-4">
                            <label className="form-label small fw-medium text-muted">Гос. номер</label>
                            <div
                            className="form-control bg-white border text-center fw-bold"
                            style={{ fontFamily: "monospace" }}
                            >
                                {carData.stateNumber}
                            </div>
                        </div>

                        <hr />

                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-speedometer2 text-muted"></i>
                                <span className="small">Пробег</span>
                                </div>
                                <span className="fw-medium">{carData.mileage} км</span>
                            </div>
                        </div>

                        <button className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2">
                        <i className="bi bi-gear"></i>
                        Настроить автомобиль
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}