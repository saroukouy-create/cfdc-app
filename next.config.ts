import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer doit tourner en Node natif, hors bundle serveur
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
