"use client";

import "./page.css";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let url: string;
        let response: Response;
        if (isLogin) url = 'http://localhost:7000/auth/signIn';
        else {
            if (formData.password !== formData.confirmPassword) {
                setError("Пароли не совпадают!");
                return;
            }
            url = 'http://localhost:7000/auth/signUp';
        }
        response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
            credentials: 'include',
        });
        if ( response.ok ) {
            router.push("/");
        }
        else {
            const exception = await response.json();
            setError(exception["error"] || "Ошибка авторизации.");
            // console.log(exception["error"]);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            full_name: "",
            username: "",
            password: "",
            confirmPassword: "",
        });
    };

    return (
        <div className="container min-vh-100 bg-light">
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Закрыть"
                        onClick={() => setError(null)}>
                </button>
                </div>
            )}

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
                                    <label htmlFor="full_name" className="form-label fw-semibold">
                                        Полное имя
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        id="full_name"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        placeholder="Введите ваше имя"
                                        required={!isLogin}
                                    />
                                </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label fw-semibold">
                                        Email адрес
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        id="username"
                                        name="username"
                                        value={formData.username}
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