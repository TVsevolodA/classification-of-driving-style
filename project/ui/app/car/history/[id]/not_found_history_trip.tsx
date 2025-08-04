"use client"

export default function TripHistoryEmpty() {
    return (
        <div className="container py-5">
        <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
            <div className="text-center">
                {/* Иконка */}
                <div className="mb-4">
                <i className="bi bi-clock-history text-muted" style={{ fontSize: "5rem" }}></i>
                </div>

                {/* Заголовок */}
                <h2 className="mb-3 text-dark">История поездок пуста</h2>

                {/* Описание */}
                <p className="text-muted mb-4 fs-5">
                Для этого автомобиля пока нет записей о поездках.
                <br />
                Начните использовать автомобиль, и история появится здесь.
                </p>

                {/* Дополнительная информация */}
                <div className="card bg-light border-0 mb-4">
                <div className="card-body">
                    <div className="row g-3 text-center">
                    <div className="col-md-4">
                        <i className="bi bi-geo-alt text-primary fs-4 d-block mb-2"></i>
                        <small className="text-muted">Маршруты</small>
                        <div className="fw-semibold">0</div>
                    </div>
                    <div className="col-md-4">
                        <i className="bi bi-speedometer text-success fs-4 d-block mb-2"></i>
                        <small className="text-muted">Пробег</small>
                        <div className="fw-semibold">0 км</div>
                    </div>
                    <div className="col-md-4">
                        <i className="bi bi-fuel-pump text-info fs-4 d-block mb-2"></i>
                        <small className="text-muted">Топливо</small>
                        <div className="fw-semibold">0 л</div>
                    </div>
                    </div>
                </div>
                </div>

                {/* Кнопки действий */}
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                <button className="btn btn-primary px-4" onClick={() => window.location.reload()}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Обновить
                </button>
                <a href="/" className="btn btn-outline-secondary px-4">
                    <i className="bi bi-house me-2"></i>
                    На главную
                </a>
                </div>

                {/* Подсказка */}
                <div className="mt-5 p-3 bg-primary bg-opacity-10 rounded">
                <div className="d-flex align-items-center justify-content-center gap-2 text-primary">
                    <i className="bi bi-lightbulb"></i>
                    <small className="fw-medium">
                    Совет: История поездок автоматически записывается при использовании автомобиля
                    </small>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}