"use client"

export default function EditProfileForm() {
    return (
    <div
        className="modal fade"
        id="editProfileModal"
        tabIndex={-1}
        aria-labelledby="editProfileModalLabel"
        aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="editProfileModalLabel">
                            <i className="bi bi-person-circle me-2"></i>
                            Редактирование профиля
                        </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                    </div>

                    <div className="modal-body">
                        <form id="editProfileForm">
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
                                    placeholder="Введите ваше имя"
                                    defaultValue="Иван Петров"
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
                                    placeholder="Введите ваш email"
                                    defaultValue="ivan.petrov@example.com"
                                />
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
                                    className="form-control"
                                    id="userPassword"
                                    placeholder="Введите новый пароль"
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
                                <div className="form-text">Оставьте пустым, если не хотите менять пароль</div>
                            </div>

                            {/* Подтверждение пароля */}
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">
                                    <i className="bi bi-lock-fill me-2"></i>
                                    Подтвердите пароль
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    placeholder="Подтвердите новый пароль"
                                />
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            <i className="bi bi-x-circle me-2"></i>
                            Отмена
                        </button>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                            // Здесь можно добавить логику сохранения данных
                            alert("Данные сохранены!")
                            }}
                        >
                            <i className="bi bi-check-circle me-2"></i>
                            Сохранить изменения
                        </button>
                    </div>
                </div>
            </div>
    </div>
    );
}