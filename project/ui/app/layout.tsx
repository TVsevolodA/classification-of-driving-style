import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
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
              <a href="/auth" className="nav-link d-flex align-items-center" title="Вход в личный кабинет">
                <i className="bi bi-person fs-2" style={{ fontSize: "1.5rem" }} />
                
              </a>
            </div>

          </div>
        </nav>
        <main style={{ display: 'flex',  alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </main>
      </body>
    </html>
  )
}