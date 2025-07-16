"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import сheckAuth from "../components/authorization_verification";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [isLogIn, setIsLogIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.js");
  }, []);
  useEffect(() => {
    сheckAuth().then((isAuthenticated) => {
      setIsLogIn(isAuthenticated["isLogIn"]);
      setUserInfo(isAuthenticated["info"]);
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
              {isLogIn ? (
                <li className="nav-item">
                  <a href={`/profile/${userInfo["username"]}`} className="nav-link d-flex align-items-center">
                    <i className="me-1 bi bi-person fs-3"/>
                    {userInfo["full_name"]}
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
  </html>
  );
}