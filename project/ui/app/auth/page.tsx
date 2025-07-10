"use client"

import type React from "react";
import { useState } from "react";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            console.log("Login attempt:", { email: formData.email, password: formData.password })
            alert("Попытка входа в систему");
        } else {
            if (formData.password !== formData.confirmPassword) {
            alert("Пароли не совпадают!");
            return;
            }
            console.log("Registration attempt:", formData)
            alert("Попытка регистрации");
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
    };

    return (
        <div className="container min-vh-100 bg-light">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h2 className="card-title fw-bold text-primary">{isLogin ? "Вход в систему" : "Регистрация"}</h2>
                                <p className="text-muted">{isLogin ? "Введите свои данные для входа" : "Создайте новый аккаунт"}</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {!isLogin && (
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label fw-semibold">
                                    Полное имя
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Введите ваше имя"
                                    required={!isLogin}
                                    />
                                </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold">
                                        Email адрес
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="example@email.com"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-semibold">
                                        Пароль
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Введите пароль"
                                        required
                                    />
                                </div>

                                {!isLogin && (
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label fw-semibold">
                                    Подтвердите пароль
                                    </label>
                                    <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Повторите пароль"
                                    required={!isLogin}
                                    />
                                </div>
                                )}

                                {/* {isLogin && (
                                <div className="mb-3 d-flex justify-content-between align-items-center">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="rememberMe" />
                                        <label className="form-check-label text-muted" htmlFor="rememberMe">
                                            Запомнить меня
                                        </label>
                                    </div>
                                </div>
                                )} */}

                                <div className="d-grid mb-4">
                                <button type="submit" className="btn btn-primary btn-lg fw-semibold">
                                    {isLogin ? "Войти" : "Зарегистрироваться"}
                                </button>
                                </div>
                            </form>

                            <div className="text-center">
                                <span className="text-muted">{isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}</span>{" "}
                                <button
                                    type="button"
                                    className="btn btn-link p-0 text-decoration-none fw-semibold"
                                    onClick={toggleMode}
                                    >
                                    {isLogin ? "Зарегистрироваться" : "Войти"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}