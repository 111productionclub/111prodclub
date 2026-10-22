"use client";

import { useCart } from "@/lib/cart";

export default function CartButton() {
    const { count, setOpen } = useCart();

    return (
        <button type="button" onClick={() => setOpen(true)} className="text-h3 font-medium hover:underline">
            Корзина ({count})
        </button>
    );
}
