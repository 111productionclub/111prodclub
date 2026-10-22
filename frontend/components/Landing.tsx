import SectionLabel from "./SectionLabel";
import Link from "next/link";
const points: string[] = [
    "Пишем код руками, без конструкторов.",
    "Держим сайт на своём сервере и следим, чтобы он жил.",
    "Вы видите статистику посещений в личном кабинете.",
];
export default function Landing() {
    return (
        <section className="bg-white text-black grid grid-cols-2 items-end px-[104px] py-36">  
            <div>
                <SectionLabel>/ 03 — Лендинг</SectionLabel>
                <p className="text-display-xl">7 дней</p>
            </div>
            <div className="flex flex-col gap-4">
                {points.map((point) => (
                    <p key={point} className="text-h3 text-black/50">
                        {point}
                    </p>
                ))}
                <div className="mt-10 flex items-center gap-20">
                    <a href="https://t.me/III_cult" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 rounded-full bg-black px-8 py-3 text-white">Обсудить проект
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
