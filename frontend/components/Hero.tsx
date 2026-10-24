import type { CSSProperties } from "react";

const after = (seconds: number) => ({ "--intro-delay": `${seconds}s` }) as CSSProperties;

export default function Hero() {
    return (
        <section className="intro-scan flex flex-col items-center justify-center px-5 pt-24 pb-[104px] text-center md:h-[704px] md:py-0">
            <p className="intro-fade text-xl md:text-lead" style={after(1.8)}>Welcome to</p>
            <h1 className="glitch text-hero-m md:text-hero mt-5 md:mt-14" data-text="111 production club">
                111 production club
            </h1>
            <p className="intro-wipe text-base md:text-h3 mt-5 md:mt-11" style={after(2)}>
                Terrorize yourself
                <br />
                Stay terrified
            </p>
        </section>
    );
}