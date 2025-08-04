"use client"

export default function DriversEmpty() {
    return (
        <div className="container py-5">
        <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
            <div className="text-center">
                {/* Иконка */}
                <div className="mb-4">
                <i className="bi bi-people text-muted" style={{ fontSize: "5rem" }}></i>
                </div>

                {/* Заголовок */}
                <h2 className="mb-3 text-dark">Нет водителей в системе</h2>

                {/* Описание */}
                <p className="text-muted mb-4 fs-5">
                В вашем автопарке пока нет зарегистрированных водителей.
                <br />
                Добавьте первого водителя, чтобы начать управление персоналом.
                </p>

                {/* Информационные карточки */}
                <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card bg-light border-0">
                    <div className="card-body text-center py-3">
                        <i className="bi bi-person-plus text-primary fs-4 d-block mb-2"></i>
                        <small className="text-muted">Водители</small>
                        <div className="fw-semibold">0</div>
                    </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-light border-0">
                    <div className="card-body text-center py-3">
                        <i className="bi bi-card-text text-success fs-4 d-block mb-2"></i>
                        <small className="text-muted">Лицензии</small>
                        <div className="fw-semibold">0</div>
                    </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-light border-0">
                    <div className="card-body text-center py-3">
                        <i className="bi bi-star text-warning fs-4 d-block mb-2"></i>
                        <small className="text-muted">Рейтинг</small>
                        <div className="fw-semibold">—</div>
                    </div>
                    </div>
                </div>
                </div>

                {/* Кнопки действий */}
                <div className="d-flex gap-3 justify-content-center flex-wrap mb-4">
                <button className="btn btn-primary px-4">
                    <i className="bi bi-person-plus me-2"></i>
                    Добавить водителя
                </button>
                <button className="btn btn-outline-secondary px-4" onClick={() => window.location.reload()}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Обновить
                </button>
                </div>

                {/* Подсказки */}
                <div className="row g-3">
                <div className="col-md-6">
                    <div className="p-3 bg-primary bg-opacity-10 rounded">
                    <div className="d-flex align-items-start gap-2">
                        <i className="bi bi-lightbulb text-primary mt-1"></i>
                        <div className="text-start">
                        <small className="fw-medium text-primary d-block">Быстрый старт</small>
                        <small className="text-muted">
                            Добавьте водителей с их контактными данными и водительскими правами
                        </small>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="p-3 bg-success bg-opacity-10 rounded">
                    <div className="d-flex align-items-start gap-2">
                        <i className="bi bi-shield-check text-success mt-1"></i>
                        <div className="text-start">
                        <small className="fw-medium text-success d-block">Безопасность</small>
                        <small className="text-muted">Система отслеживает рейтинги и нарушения водителей</small>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}
