import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthInitializer from "../components/AuthInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abonos GEVP",
  description: "Gestión de abonos",
  icons: {
    icon: "/public/imagenes/escudoGevp.png",
    shortcut: "/public/imagenes/escudoGevp.png",
    apple: "/public/imagenes/escudoGevp.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-800 h-screen flex flex-col`}
      >
        <AuthInitializer />
        <main className="flex-1 flex items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
