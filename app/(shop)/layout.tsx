import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import Script from "next/script";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <Script 
        src="https://cloud.umami.is/script.js" 
        data-website-id="fbf3864d-ce94-45a7-b423-9bcee20b9390" 
        strategy="afterInteractive" 
      />
    </>
  );
}
