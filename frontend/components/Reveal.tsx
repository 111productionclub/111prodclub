"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
    children: React.ReactNode
    // fade: плавное появление со сдвигом. glitch: короткая «помеха», только для небольших заголовков
    variant?: "fade" | "glitch"
    // Не показывать раньше, чем через столько мс после загрузки страницы (чтобы не мешать вступлению на главной)
    waitFor?: number
    // Дополнительная задержка после того, как блок попал в экран
    delay?: number
    className?: string
};

// Появление блока один раз, когда он попадает в экран.
// Стили лежат в globals.css: блок скрыт только если работает JS и пользователь не отключил анимации.
export default function Reveal({ children, variant = "fade", waitFor = 0, delay = 0, className }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let timer: ReturnType<typeof setTimeout>;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                const wait = Math.max(0, waitFor - performance.now()) + delay;
                timer = setTimeout(() => setShown(true), wait);
            },
            { rootMargin: "0px 0px -10% 0px" },
        );
        observer.observe(element);

        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, [waitFor, delay]);

    return (
        <div ref={ref} data-reveal={variant} data-shown={shown} className={className}>
            {children}
        </div>
    );
}
