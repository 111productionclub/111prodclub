"use client";

import { useEffect } from "react";
import { cartKey, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export default function CartDrawer() {
    const { open, setOpen, items, total, changeQuantity, removeItem } = useCart();

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, setOpen]);

    return (
        <>
            <div
                onClick={() => setOpen(false)}
                className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
            />
            <aside
                inert={!open}
                aria-label="Корзина"
                className={`fixed right-0 top-0 z-50 flex h-full w-[440px] flex-col border-l border-white/30 bg-black px-8 py-8 transition-transform ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-h1">Корзина</h2>
                    <button type="button" onClick={() => setOpen(false)} className="text-sm text-white/50 hover:text-white">
                        закрыть
                    </button>
                </div>

                {items.length === 0 ? (
                    <p className="mt-10 text-white/50">Пока пусто</p>
                ) : (
                    <ul className="mt-8 flex-1 divide-y divide-white/30 overflow-y-auto">
                        {items.map((item) => {
                            const key = cartKey(item);
                            return (
                                <li key={key} className="py-5">
                                    <div className="flex items-baseline justify-between gap-4">
                                        <p className="text-lg">{item.title}</p>
                                        <p className="text-sm">{formatPrice(Number(item.price) * item.quantity)}</p>
                                    </div>
                                    <p className="mt-1 font-mono text-xs text-white/50">
                                        {item.sku} · размер {item.size}
                                    </p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => changeQuantity(key, -1)}
                                                aria-label="Меньше"
                                                className="h-8 w-8 rounded-full border border-white/30 hover:border-white"
                                            >
                                                −
                                            </button>
                                            <span className="w-4 text-center text-sm">{item.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => changeQuantity(key, 1)}
                                                aria-label="Больше"
                                                className="h-8 w-8 rounded-full border border-white/30 hover:border-white"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(key)}
                                            className="text-sm text-white/50 underline hover:text-white"
                                        >
                                            убрать
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {items.length > 0 && (
                    <div className="border-t border-white/30 pt-5">
                        <div className="flex items-baseline justify-between">
                            <span className="text-white/50">Итого</span>
                            <span className="text-xl">{formatPrice(total)}</span>
                        </div>
                        <button
                            type="button"
                            disabled
                            className="mt-5 h-12 w-full rounded-lg bg-white/20 font-medium text-white/40"
                        >
                            Оформление заказа скоро
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
