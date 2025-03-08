import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que requerem autenticação
const protectedRoutes = ["/profile"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Verificar se a rota é protegida
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  
  if (isProtectedRoute) {
    // Verificar se o usuário tem um token no cookie
    const token = request.cookies.get("next-auth.session-token")?.value || 
                  request.cookies.get("__Secure-next-auth.session-token")?.value;
    
    // Se não tiver token, redirecionar para login
    if (!token) {
      const url = new URL("/auth", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
  ],
};