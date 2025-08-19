// export default function Page() {
//   return (
//     <div>
//       <span>Добро пожаловать</span>
//     </div>
//   );
// }
"use client"

import { User } from "../models/user";
import { useUser } from "./user_context";

export default function HomePage() {
  const user: User = useUser();
  return (
    <div className="min-vh-100">

      {/* Main Section */}
      <section className="bg-primary bg-gradient text-white py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Управляйте автопарком
                <span className="text-warning"> эффективно</span>
              </h1>
              <p className="lead mb-4">
                Современная система управления автопарком для контроля автомобилей, водителей и поездок. Оптимизируйте
                расходы и повышайте безопасность с DriveClassifier.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <a href={user ? `/profile/${user.id}` : "/auth"} className="btn btn-warning btn-lg px-4">
                  <i className="bi bi-rocket-takeoff me-2"></i>
                  Начать работу
                </a>
                {/* <button className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-play-circle me-2"></i>
                  Демо видео
                </button> */}
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="position-relative">
                <i className="bi bi-car-front" style={{ fontSize: "20rem", color: "#4d4d4d" }}></i>
                <div className="position-absolute top-50 start-50 translate-middle">
                  <i className="bi bi-speedometer2 text-warning" style={{ fontSize: "4rem" }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Возможности системы</h2>
            <p className="lead text-muted">Все необходимые инструменты для эффективного управления автопарком</p>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="bi bi-car-front text-primary" style={{ fontSize: "2rem" }}></i>
                  </div>
                  <h5 className="fw-bold mb-3">Управление автомобилями</h5>
                  <p className="text-muted">
                    Ведите учет всех автомобилей: марка, модель, год выпуска, пробег и техническое состояние.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="bi bi-people text-success" style={{ fontSize: "2rem" }}></i>
                  </div>
                  <h5 className="fw-bold mb-3">База водителей</h5>
                  <p className="text-muted">
                    Управляйте данными водителей, отслеживайте рейтинги, нарушения и сроки действия прав.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="bi bi-clock-history text-info" style={{ fontSize: "2rem" }}></i>
                  </div>
                  <h5 className="fw-bold mb-3">История поездок</h5>
                  <p className="text-muted">
                    Детальная история всех поездок с информацией о маршрутах, расходе топлива и нарушениях.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="bi bi-graph-up text-warning" style={{ fontSize: "2rem" }}></i>
                  </div>
                  <h5 className="fw-bold mb-3">Аналитика и отчеты</h5>
                  <p className="text-muted">
                    Получайте подробную статистику по расходам, пробегу и эффективности использования автопарка.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="bi bi-shield-check text-danger" style={{ fontSize: "2rem" }}></i>
                  </div>
                  <h5 className="fw-bold mb-3">Контроль безопасности</h5>
                  <p className="text-muted">
                    Мониторинг нарушений ПДД, контроль скорости и уведомления о критических ситуациях.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="bi bi-bell text-secondary" style={{ fontSize: "2rem" }}></i>
                  </div>
                  <h5 className="fw-bold mb-3">Уведомления</h5>
                  <p className="text-muted">
                    Автоматические напоминания о техосмотре, страховке и истечении срока водительских прав.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary bg-gradient text-white py-5">
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-4">Готовы оптимизировать свой автопарк?</h2>
              <p className="lead mb-4">
                Присоединяйтесь к проекту для эффективного управления своим автопарком.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <a href={user ? `/profile/${user.id}` : "/auth"} className="btn btn-warning btn-lg px-5">
                  <i className="bi bi-rocket-takeoff me-2"></i>
                  Начать бесплатно
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light py-5" style={{ color: 'blue' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0">© 2025-2026 DriveClassifier.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0">
                <i className="bi bi-github me-2"></i>
                Проект доступен на{" "}
                <a
                  href="https://github.com/TVsevolodA/classification-of-driving-style"
                  className="text-primary text-decoration-none"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}