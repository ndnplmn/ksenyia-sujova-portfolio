import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import Preloader from "@/components/Preloader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ksenyia Sujova — Digital Art Director",
  description: "Official portfolio of Ksenyia Sujova. Art Director and UI/UX Designer.",
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {/* Filtro global de Ruido / Film Grain para dar textura analógica */}
        <div className="noise-overlay" />
        <Preloader />
        <SmoothScrollProvider>
          <CustomCursor />
          <Header />
          <div id="smooth-wrapper">
            <main id="smooth-content">
              {children}
            </main>
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
