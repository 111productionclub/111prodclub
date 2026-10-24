import SectionLabel from "./SectionLabel";
import Link from "next/link";
const points: string[] = [
    "Пишем код руками, без конструкторов.",
    "Держим сайт на своём сервере и следим, чтобы он жил.",
    "Вы видите статистику посещений в личном кабинете.",
];
export default function Landing() {
    return (
        <section className="bg-white text-black grid grid-cols-1 lg:grid-cols-2 items-end px-5 pt-16 pb-[72px] md:px-[104px] md:py-36">
            <div>
                <SectionLabel>/ 03 — Лендинг</SectionLabel>
                <p className="text-display-xl-m md:text-display-xl md:tracking-normal">7 дней</p>
            </div>
            <div className="flex flex-col gap-3 md:gap-4 mt-6 lg:mt-0">
                {points.map((point) => (
                    <p key={point} className="text-base md:text-h3 text-black/50">
                        {point}
                    </p>
                ))}
                <div className="mt-8 flex flex-col items-center gap-5 md:mt-10 md:flex-row md:gap-20">
                    <a href="https://t.me/III_cult" target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-between gap-6 rounded-full bg-black py-2.5 pl-7 pr-4 text-h3 text-white md:w-auto md:px-8 md:py-3 md:text-base md:tracking-normal">Обсудить проект
                        <svg className="size-9" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 18H28.5M18 28.5L28.5 18L18 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                    <Link href="/works" className="text-h3 underline">Наши работы</Link>
                </div>
            </div>
        </section>

    );
}
