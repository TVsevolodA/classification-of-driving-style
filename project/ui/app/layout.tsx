"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import checkAuth from "../components/authorization_verification";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    checkAuth().then((isAuthenticated) => {
      setIsLogin(isAuthenticated["isLogIn"]);
      setUser(isAuthenticated["info"]);
      console.log('Статус авторизации:', isAuthenticated);
    });
  }, [pathname]);
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a href="/" className="navbar-brand d-flex align-items-center">
              <i className="me-2 bi bi-car-front fs-2"></i>
              <span className="fw-bold">DriveClassifier</span>
            </a>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a href="/prediction_stream" className="nav-link d-flex align-items-center">
                    <i className="me-1 bi bi-people fs-3"></i>
                    Автомобили онлайн
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/inference_instance" className="nav-link d-flex align-items-center">
                    <i className="me-1 bi bi-activity fs-3"></i>
                    Классификация
                  </a>
                </li>
              </ul>

              <ul className="navbar-nav">
                {isLogin ? (
                  <li className="nav-item">
                    <a href="/auth" className="nav-link d-flex align-items-center">
                      <i className="me-1 bi bi-person fs-3"/>
                      {user["full_name"]}
                    </a>
                  </li>
                ) : (
                    <a href="/auth" className="nav-link d-flex align-items-center">
                      <i className="me-1 bi bi-box-arrow-in-right fs-3"/>
                      Войти
                    </a>
                )}
              </ul>
            </div>
          </div>
        </nav>

          {/* <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">
                DrivingStyleAPI
              </a>

              <div className="collapse navbar-collapse">
                <ul className="navbar-nav">
                    <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/">Главная</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="/prediction_stream">Потоковое предсказание</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="/inference_instance">Единичное предсказание</a>
                    </li>
                </ul>
              </div>

              <div className="ms-auto">
                <a href="/auth" className="btn btn-primary nav-link d-flex align-items-center" title="Личный кабинет">
                  <i className="bi bi-person-circle me-1"></i>
                  Личный кабинет
                </a>
                <a href="/auth" className="nav-link d-flex align-items-center" title="Вход в личный кабинет">
                    <i className="bi bi-person fs-2" style={{ fontSize: "1.5rem" }} />
                </a>
              </div>
              <div className="ms-auto">
                {isLogin ? (<a className="btn btn-danger d-none" onClick={logOut}
                // style={{ width: "100%", height: "auto" }}
                >
                              <i className="bi bi-box-arrow-right me-1"></i>
                              Выйти
                            </a>) :
                            (<div/>)}
              </div>
            </div>
          </nav> */}
          <main style={{ display: 'flex',  alignItems: 'center', justifyContent: 'center' }}>
            {children}
          </main>
      </body>
    </html>
  )
}