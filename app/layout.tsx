import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AlertProvider } from "@/hooks/useAlert";
import { JsonLd } from "@/components/common/JsonLd";


const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const SITE_URL = "https://nadiradecants.com.ar";
const SITE_NAME = "Nadira Decants";
const SITE_DESCRIPTION =
  "Descubrí las fragancias más exclusivas del mundo en formato decant. Perfumes originales de lujo en envases de 5ml. Probá antes de comprometerte con el frasco completo. Envíos a todo Argentina.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nadira — Decants de Perfumes de Lujo | Argentina",
    template: "%s | Nadira Decants",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "perfumes",
    "decants",
    "fragancias de lujo",
    "perfumes originales",
    "nadira decants",
    "decants argentina",
    "perfumes en formato chico",
    "probar perfumes",
    "atomizadores de perfume",
    "comprar decants online",
    "perfumería de nicho",
    "decants de perfumes originales",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nadira — Decants de Perfumes de Lujo",
    description:
      "Descubrí las fragancias más exclusivas del mundo en formato decant. Perfumes originales de lujo, probá antes de comprar el frasco completo.",
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "Nadira — Decants de Perfumes de Lujo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nadira — Decants de Perfumes de Lujo",
    description:
      "Descubrí las fragancias más exclusivas del mundo en formato decant. Perfumes originales de lujo.",
    images: ["/images/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification when available
    // google: "your-verification-code",
  },
  category: "shopping",
};

// Organization + WebSite JSON-LD — global for all pages
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logonadira.png`,
  description: SITE_DESCRIPTION,
  email: "nadira.beauty.baradero@gmail.com",
  telephone: "+5493329516307",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Baradero",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  sameAs: [
    "https://www.instagram.com/nadiradecants.baradero/",
    "https://www.tiktok.com/@nadira.decants",
    "https://www.facebook.com/nadiradecants.baradero",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+5493329516307",
    contactType: "customer service",
    availableLanguage: "Spanish",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "es-AR",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
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
      className={`${cormorant.variable} ${dmSans.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('nadira-theme');
                  if (theme === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch(e) {}
              })();
            `
          }}
        />
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
      </head>
      <body
        className="min-h-screen flex flex-col font-body transition-colors duration-500"
        style={{
          fontFamily: "var(--font-body)",
        }}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AlertProvider>
            {children}
          </AlertProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
