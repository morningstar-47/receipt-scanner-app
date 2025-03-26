import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = ["/login", "/register", "/forgot-password"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  // et essaie d'accéder à une route protégée
  if (!token && !publicRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Rediriger vers la page d'accueil si l'utilisateur est déjà authentifié
  // et essaie d'accéder à une page publique (login, register, etc.)
  if (token && publicRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

