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