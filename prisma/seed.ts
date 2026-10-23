// Cree le premier compte administrateur (ADMIN_EMAIL / ADMIN_PASSWORD de .env.local).
// Relancable sans risque : ne modifie pas un compte existant.
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim()
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password || password.length < 8) throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD (8 caractères min.) requis")

  const existant = await prisma.user.findUnique({ where: { email } })
  if (existant) return console.log(`Compte ${email} déjà présent (${existant.role}), rien à faire.`)

  await prisma.user.create({
    data: { email, password: await bcrypt.hash(password, 10), nom: "CFDC", prenom: "Administrateur", role: "ADMIN" },
  })
  console.log(`Administrateur ${email} créé.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
