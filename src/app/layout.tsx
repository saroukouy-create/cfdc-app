import type { Metadata, Viewport } from "next";
import { EB_Garamond, Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Titres du site public (classe .titres-serif) : serif d'autorite recommande par UI UX Pro Max pour un cabinet
const ebGaramond = EB_Garamond({
  variable: "--font-titre",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "CFDC — Bureau d'études", template: "%s · CFDC" },
  description:
    "CFDC accompagne les entrepreneurs et dirigeants de TPE/PME : création d'entreprise, gestion, assistance comptable, fiscale et sociale.",
  // iOS : ajout a l'ecran d'accueil en mode application
  appleWebApp: { capable: true, title: "CFDC", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // occupe tout l'ecran des iPhone a encoche ; les marges sures sont gerees en CSS (env(safe-area-inset-*))
  viewportFit: "cover",
  themeColor: "#0f4c81",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${ebGaramond.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {/* Clavier : premier element tabulable, saute la navigation */}
        <a href="#contenu" className="lien-evitement">
          Aller au contenu
        </a>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
