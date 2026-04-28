import React from "react";
import Image from "next/image";

export const PaymentMethods = () => {
  const logos = [
    { name: "Mercado Pago", src: "/tarjetaslogos/mercadopagologo.webp" },
    { name: "Visa", src: "/tarjetaslogos/visalogo.webp" },
    { name: "Mastercard", src: "/tarjetaslogos/mastercardlogo.webp" },
    { name: "American Express", src: "/tarjetaslogos/americanexpresslogo.webp" },
    { name: "Naranja X", src: "/tarjetaslogos/naranjax.webp" },
    { name: "Pago Fácil", src: "/tarjetaslogos/pagofacillogo.webp" },
    { name: "Rapipago", src: "/tarjetaslogos/rapipagologo.webp" },
    { name: "Cabal", src: "/tarjetaslogos/caballogo.webp" },
    { name: "Argencard", src: "/tarjetaslogos/argencardlogo.webp" }
  ];

  return (
    <div className="mt-5 pt-5" style={{ borderTop: "1px dashed var(--border)" }}>
      <p className="text-[11px] mb-3 font-bold tracking-[0.1em] uppercase" style={{ color: "var(--text-primary)" }}>
        Medios de Pago
      </p>
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {logos.map((logo) => (
          <div
            key={logo.name}
            className="relative flex items-center justify-center h-[26px] w-[42px] sm:h-[32px] sm:w-[50px] bg-white rounded-[2px] overflow-hidden flex-shrink-0"
            title={logo.name}
          >
            <Image
              src={logo.src}
              alt={`Logo de ${logo.name}`}
              fill
              sizes="(max-width: 640px) 42px, 50px"
              className="object-contain p-0.5 sm:p-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
