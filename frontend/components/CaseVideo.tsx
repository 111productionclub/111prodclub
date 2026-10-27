"use client";

import { useEffect, useRef } from "react";

type CaseVideoProps = {
    src: string
    poster?: string
    className?: string
};

export default function CaseVideo({ src, poster, className = "" }: CaseVideoProps) {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = ref.current;
        if (!video) return;

        video.muted = true;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) return;

        video.play().catch(() => {});
    }, []);

    return (
        <video
            ref={ref}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            className={`object-cover ${className}`}
        />
    );
}