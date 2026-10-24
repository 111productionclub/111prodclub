"use client"

import { useEffect, useRef, useState } from "react";
import Link from "next/link"

type MenuItem = { label: string; href: string};

export default function MobileMenu({ items }: { items: MenuItem[] }) {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
                buttonRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);

    }, [open]);

    useEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = previous; };
    }, [open]);

    useEffect(() => {
        const query = window.matchMedia("(min-width: 768px)");
        const onChange = () => { if (query.matches) setOpen(false); };
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);

    return (
        <div className="md:hidden">
            <button
                ref={buttonRef}
                type="button"
                aria-label={open ? "Закрыть меню" : "Открыть меню"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen(!open)}
                className="flex size-11 items-center justify-center"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    {open ? <path d="M6 6L18 18M18 6L6 18" /> : <path d="M4 8H20M4 16H20" />}
                </svg>
            </button>

            <div
                id="mobile-menu"
                inert={!open}
                className={`fixed inset-x-0 bottom-0 top-[84px] z-30 bg-black px-5 pt-4 transition-opacity ${
                    open ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            >
                <nav aria-label="Мобильная навигация">
                    <ul>
                        {items.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="block border-t border-white/30 py-5 text-3xl font-medium"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    )
}