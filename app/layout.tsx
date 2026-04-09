import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AlertProvider } from "@/hooks/useAlert";


const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nadira — Decants de Perfumes de Lujo",
  description:
    "Descubrí las fragancias más exclusivas del mundo en formato decant. Probá antes de comprometerte con el frasco completo.",
  keywords: ["perfumes", "decants", "fragancias", "lujo", "nadira"],
  openGraph: {
    title: "Nadira — Decants de Perfumes de Lujo",
    description:
      "Descubrí las fragancias más exclusivas del mundo en formato decant.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col font-body transition-colors duration-500"
        style={{
          fontFamily: "var(--font-body)",
        }}
        suppressHydrationWarning
      >
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
        >
          {`
            (function() {
              try {
                var theme = localStorage.getItem('nadira-theme');
                if (theme === 'light') {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch(e) {}
            })();
          `}
        </Script>
        <ThemeProvider>
          <AlertProvider>
            {children}
          </AlertProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
