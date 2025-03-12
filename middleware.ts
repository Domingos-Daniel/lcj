import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que requerem autenticação
const protectedRoutes = ["/profile"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Verificar se a rota é protegida
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  
  if (isProtectedRoute) {
    // Verifica o cookie padrão do NextAuth ou o nosso cookie wp_token
    const nextAuthToken = request.cookies.get("next-auth.session-token")?.value || 
                          request.cookies.get("__Secure-next-auth.session-token")?.value;
    const wpToken = request.cookies.get("wp_token")?.value;
    
    // Se não tiver token, redirecionar para login
    if (!nextAuthToken && !wpToken) {
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