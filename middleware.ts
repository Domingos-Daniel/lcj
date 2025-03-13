import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que requerem autenticação
const protectedRoutes = ["/profile"];
// Rotas que só devem ser acessadas por usuários não autenticados
const publicOnlyRoutes = ["/auth"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Verificar tokens de autenticação
  const nextAuthToken = request.cookies.get("next-auth.session-token")?.value || 
                        request.cookies.get("__Secure-next-auth.session-token")?.value;
  const wpToken = request.cookies.get("wp_token")?.value;
  
  const isAuthenticated = !!nextAuthToken || !!wpToken;
  
  // Verificar se a rota é protegida (requer autenticação)
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  
  // Verificar se a rota é apenas para usuários não autenticados
  const isPublicOnlyRoute = publicOnlyRoutes.some(route => path.startsWith(route));
  
  // Se usuário autenticado tenta acessar rotas públicas exclusivas (ex: página de login)
  if (isPublicOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }
  
  // Se usuário não autenticado tenta acessar rotas protegidas
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/auth", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/auth",
  ],
};