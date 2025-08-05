"use client";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Role, User } from "../models/user";
import { useUser } from "./user_context";

export default function ClientLayout({ children }: { children: React.ReactNode; }) {
  const user: User = useUser();
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.js");
  }, []);
  return (
  <body>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a href="/" className="navbar-brand d-flex align-items-center">
            <i className="me-2 bi bi-truck fs-2"></i>
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
              {user ? (
                <>
                { user.role === Role.USER ?
                  <li className="nav-item">
                    <a href="/users" className="nav-link d-flex align-items-center">
                      <i className="me-1 bi bi-people-fill fs-3"/>
                      Водители
                      {/* { user.role === Role.ADMIN ? "Пользователи" : "Водители"} */}
                    </a>
                  </li>
                  : <></> }
                  <li className="nav-item">
                    <a href="/garage" className="nav-link d-flex align-items-center">
                      <i className="me-1 bi bi-car-front fs-3"/>
                      { user.role === Role.ADMIN ? "Автопарк" : "Гараж"}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href={`/profile/${user.full_name}`} className="nav-link d-flex align-items-center">
                      <i className="me-1 bi bi-person fs-3"/>
                      {user.full_name}
                    </a>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <a href="/auth" className="nav-link d-flex align-items-center">
                    <i className="me-1 bi bi-box-arrow-in-right fs-3"/>
                    Войти
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {/* style={{ display: 'flex',  alignItems: 'center', justifyContent: 'center' }} */}
      <main>
        {children}
      </main>
  </body>
  );
}