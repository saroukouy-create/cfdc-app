import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

const STAFF_PATHS = ["/dashboard", "/clients", "/creation-entreprise", "/comptabilite", "/attestations", "/prospects", "/admin"]

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role
    const path = req.nextUrl.pathname
    const isStaffPath = STAFF_PATHS.some((p) => path.startsWith(p))

    if (isStaffPath && role === "CLIENT") return NextResponse.redirect(new URL("/espace", req.url))
    if (path.startsWith("/admin") && role !== "ADMIN") return NextResponse.redirect(new URL("/dashboard", req.url))
    if (path.startsWith("/espace") && role !== "CLIENT") return NextResponse.redirect(new URL("/dashboard", req.url))
    return NextResponse.next()
  },
  { pages: { signIn: "/login" } },
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/creation-entreprise/:path*",
    "/comptabilite/:path*",
    "/attestations/:path*",
    "/prospects/:path*",
    "/admin/:path*",
    "/espace/:path*",
  ],
}
