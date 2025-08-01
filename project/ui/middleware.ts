import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Перечисляем охраняемые и общедоступные маршруты.
    const protectedRoutes = ['/inference_instance', '/prediction_stream', '/profile', '/garage', '/users', '/car'];
    const publicRoutes = ['/auth', '/'];

    // 2. Проверяем, является ли текущий маршрут защищенным или общедоступным.
    const path = request.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(routePrefix => path.startsWith(routePrefix));
    const isPublicRoute = publicRoutes.includes(path);

    // 4. Перенаправить на страницу авторизации,
    // если пользователь не прошел проверку подлинности.
    if (isProtectedRoute && !request.cookies.get('token')) {
        return NextResponse.redirect(new URL('/auth', request.nextUrl));
    }
    
    return NextResponse.next();
}