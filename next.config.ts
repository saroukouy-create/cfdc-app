import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer doit tourner en Node natif, hors bundle serveur
  serverExternalPackages: ["@react-pdf/renderer"],
  // Anciennes adresses (avant la separation des portails) : liens et favoris continuent de marcher
  async redirects() {
    const gestion = ["clients", "creation-entreprise", "comptabilite", "attestations", "prospects", "admin"]
    return [
      { source: "/login", destination: "/connexion", permanent: true },
      { source: "/dashboard", destination: "/gestion", permanent: true },
      ...gestion.flatMap((r) => [
        { source: `/${r}`, destination: `/gestion/${r}`, permanent: true },
        { source: `/${r}/:path*`, destination: `/gestion/${r}/:path*`, permanent: true },
      ]),
    ]
  },
};

export default nextConfig;
