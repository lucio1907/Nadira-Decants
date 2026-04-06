"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

interface Props {
  status: string | undefined;
}

export const CartStatusHandler = ({ status }: Props) => {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (status === "approved") {
      clearCart();
    }
  }, [status, clearCart]);

  return null; // Este componente no renderiza nada
};
