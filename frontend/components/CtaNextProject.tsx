export default function CtaNextProject() {
    return (
        <section className="flex flex-col items-start gap-8 border-t border-white/30 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-[104px] md:py-24">
            <h2 className="text-h1 leading-[1.1] tracking-tight md:text-5xl md:font-light md:leading-tight">
                Следующий кейс —
                <br />
                ваш проект
            </h2>
            <a
                href="https://t.me/III_cult"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-lg bg-white px-6 py-4 text-center font-medium text-black md:w-auto"
            >
                Обсудить проект
            </a>
        </section>
    );
}
