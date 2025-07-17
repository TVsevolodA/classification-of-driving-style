// type CheckAuthProps = {
//     children: (auth: { isLogIn: boolean, userData: any }) => React.ReactNode;
// };


// export default function CheckAuth({ children }: CheckAuthProps) {
//     let isLogIn = false;
//     let userData = {};
//     const url = 'http://localhost:7000/users/me';
//     fetch(url, {
//             method: 'GET',
//             credentials: 'include',
//         })
//         .then((res) => res.ok ? res.json() : null)
//         .then((data) => {
//           if (data) {
//             isLogIn = true;
//             userData = data;
//           } else {
//             isLogIn = false;
//             userData = {};
//           }
//       }
//         )
//     return children({ isLogIn, userData })
// }


/*
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
*/
/*
      <CheckAuth>
        {({isLogIn, userData}) => (
          <>
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
                          <a href={`/profile/${userData["username"]}`} className="nav-link d-flex align-items-center">
                            <i className="me-1 bi bi-person fs-3"/>
                            {userData["full_name"]}
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
          </>
    )}
      </CheckAuth>
*/

export default async function сheckAuth() {
    const url = 'http://localhost:7000/users/me';
    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Пользователь авторизован:');
            return {'isLogIn': true, 'info': data};
        }
        else {
            console.log('Пользователь не авторизован:', response.status);
            return {'isLogIn': false, 'info': response.status};
        }
    } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        return {'isLogIn': false, 'info': error};
    }
}