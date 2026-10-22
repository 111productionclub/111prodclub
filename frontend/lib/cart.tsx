"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";

export type CartItem = {
    slug: string
    sku: string
    title: string
    price: string
    size: string
    quantity: number
}

const STORAGE_KEY = "111-cart";
const MAX_QUANTITY = 10;
const EMPTY: CartItem[] = [];

// Корзина лежит в localStorage. useSyncExternalStore берёт оттуда данные
// и перерисовывает компоненты, когда они меняются (в том числе в другой вкладке).
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY;

function readRaw() {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

function getSnapshot() {
    const raw = readRaw();
    if (raw !== cachedRaw) {
        cachedRaw = raw;
        try {
            cachedItems = raw ? (JSON.parse(raw) as CartItem[]) : EMPTY;
        } catch {
            cachedItems = EMPTY;
        }
    }
    return cachedItems;
}

function getServerSnapshot() {
    return EMPTY;
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    window.addEventListener("storage", listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", listener);
    };
}

function save(items: CartItem[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        // localStorage может быть недоступен (приватный режим): тогда корзина просто не сохранится
    }
    listeners.forEach((listener) => listener());
}

export function cartKey(item: Pick<CartItem, "slug" | "size">) {
    return `${item.slug}:${item.size}`;
}

function addItem(item: Omit<CartItem, "quantity">) {
    const items = getSnapshot();
    const existing = items.find((i) => cartKey(i) === cartKey(item));
    if (existing) {
        save(items.map((i) => (i === existing ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QUANTITY) } : i)));
    } else {
        save([...items, { ...item, quantity: 1 }]);
    }
}

function changeQuantity(key: string, delta: number) {
    const items = getSnapshot()
        .map((i) => (cartKey(i) === key ? { ...i, quantity: Math.min(i.quantity + delta, MAX_QUANTITY) } : i))
        .filter((i) => i.quantity > 0);
    save(items);
}

function removeItem(key: string) {
    save(getSnapshot().filter((i) => cartKey(i) !== key));
}

function clear() {
    save([]);
}

type DrawerContextValue = {
    open: boolean
    setOpen: (open: boolean) => void
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    return <DrawerContext.Provider value={{ open, setOpen }}>{children}</DrawerContext.Provider>;
}

export function useCart() {
    const drawer = useContext(DrawerContext);
    if (!drawer) {
        throw new Error("useCart нужно вызывать внутри <CartProvider>");
    }
    const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    return { items, count, total, addItem, changeQuantity, removeItem, clear, ...drawer };
}
