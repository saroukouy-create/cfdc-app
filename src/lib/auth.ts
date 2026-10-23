import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import type { Role } from "@prisma/client"
import { prisma } from "./prisma"

// Pas de PrismaAdapter : connexion par identifiants + JWT, aucune table Account/Session.
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        // Portail d'ou vient la connexion : "gestion" (equipe CFDC) ou "client"
        portail: { label: "Portail", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null
        // Separation des portails, imposee cote serveur : un client ne se connecte pas a la gestion, et inversement
        const estEquipe = STAFF.includes(user.role)
        if ((credentials.portail === "gestion") !== estEquipe) return null
        return { id: user.id, email: user.email, name: `${user.prenom} ${user.nom}`, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      return session
    },
  },
  pages: { signIn: "/connexion" },
}

export const STAFF: Role[] = ["ADMIN", "CONSEILLER"]

export function getSession() {
  return getServerSession(authOptions)
}

/** Pour les routes API : renvoie la session, ou une reponse 401/403 a retourner telle quelle. */
export async function requireRole(roles: Role[]) {
  const session = await getSession()
  if (!session) return { error: NextResponse.json({ error: "Non authentifie" }, { status: 401 }) }
  if (!roles.includes(session.user.role))
    return { error: NextResponse.json({ error: "Acces refuse" }, { status: 403 }) }
  return { session }
}

/** clientId du compte CLIENT connecte (null pour le personnel). */
export async function clientIdOf(userId: string) {
  const c = await prisma.client.findUnique({ where: { userId }, select: { id: true } })
  return c?.id ?? null
}
