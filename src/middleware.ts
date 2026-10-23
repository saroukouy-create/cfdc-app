import { getToken } from "next-auth/jwt"
import { NextResponse, type NextRequest } from "next/server"

// Deux portails : /gestion (equipe CFDC) et /espace (clients), chacun avec sa page de connexion.
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const gestion = pathname.startsWith("/gestion")
  const token = await getToken({ req })

  if (!token) {
    const connexion = new URL(gestion ? "/gestion/connexion" : "/connexion", req.url)
    connexion.searchParams.set("callbackUrl", pathname + search)
    return NextResponse.redirect(connexion)
  }

  const equipe = token.role === "ADMIN" || token.role === "CONSEILLER"
  if (gestion && !equipe) return NextResponse.redirect(new URL("/espace", req.url))
  if (!gestion && equipe) return NextResponse.redirect(new URL("/gestion", req.url))
  if (pathname.startsWith("/gestion/admin") && token.role !== "ADMIN") return NextResponse.redirect(new URL("/gestion", req.url))
  return NextResponse.next()
}

export const config = {
  // La page /gestion/connexion reste publique
  matcher: ["/gestion", "/gestion/((?!connexion).*)", "/espace/:path*"],
}
