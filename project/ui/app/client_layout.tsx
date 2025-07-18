"use client";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ClientLayout({ children, user }: { children: React.ReactNode; user: Object;}) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.js");
  }, []);
    return (
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
              {user !== null ? (
                <li className="nav-item">
                  <a href={`/profile/${user["full_name"]}`} className="nav-link d-flex align-items-center">
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
      <main style={{ display: 'flex',  alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </main>
    </body>
    );
}