"use client";

import { useState } from "react";
import type { ProductDetail } from "@/lib/api";
import { useCart } from "@/lib/cart";

type ProductBuyProps = {
    product: Pick<ProductDetail, "slug" | "sku" | "title" | "price" | "sizes">
};

export default function ProductBuy({ product }: ProductBuyProps) {
    const { sizes } = product;
    const { addItem, setOpen } = useCart();
    const firstAvailable = sizes.find((size) => size.stock > 0)?.label;
    const [selected, setSelected] = useState<string | undefined>(firstAvailable);

    return (
        <>
            <div className="mt-10 flex items-baseline justify-between font-mono text-xs text-white/50">
                <span>размер</span>
                <span className="underline">таблица размеров</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map((size) => {
                    const available = size.stock > 0;
                    const isActive = size.label === selected;
                    return (
                        <button
                            key={size.label}
                            type="button"
                            disabled={!available}
                            onClick={() => setSelected(size.label)}
                            className={`h-10 min-w-[52px] rounded-full border px-4 text-sm ${
                                isActive
                                    ? "border-white bg-white text-black"
                                    : available
                                      ? "border-white/30 hover:border-white"
                                      : "cursor-not-allowed border-white/10 text-white/20 line-through"
                            }`}
                        >
                            {size.label}
                        </button>
                    );
                })}
            </div>
            <button
                type="button"
                disabled={!selected}
                onClick={() => {
                    if (!selected) return;
                    addItem({ slug: product.slug, sku: product.sku, title: product.title, price: product.price, size: selected });
                    setOpen(true);
                }}
                className="mt-6 h-12 w-full rounded-lg bg-white font-medium text-black disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
            >
                {selected ? "В корзину" : "Нет в наличии"}
            </button>
        </>
    );
}
