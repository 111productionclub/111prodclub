import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";
type TimelineItem = {
    title: string;
    duration: string;
};

const items: TimelineItem[] = [
    { title: "От идеи до запуска", duration: "от 7 дней" },
    { title: "Многостраничный сайт", duration: "2–4 недели" },
    { title: "Магазин / бэкенд", duration: "от 4 недель" },
    { title: "Хостинг и поддержка", duration: "подписка" },
];
export default function Timeline() {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] lg:gap-x-24 px-5 py-16 md:px-[104px] md:py-24">
            <div>
                <SectionLabel>/ 02 — сроки</SectionLabel>
                <Reveal variant="glitch" delay={250}>
                    <h2 className="mt-2 text-display-m md:text-display md:tracking-normal">
                        Сколько
                        <br />
                        ждать
                    </h2>
                </Reveal>
            </div>


            <ul className="mt-8 lg:mt-0">
                {items.map(
                    (item) => (
                        <li key={item.title} className="flex items-center justify-between py-5 md:py-6 border-t border-white/30 lg:border-0 gap-4">
                            <span className="text-xl md:text-2xl min-w-0">{item.title}</span>
                            <span className="text-xs text-white/50 shrink-0 whitespace-nowrap">{item.duration}</span>
                        </li>
                    ))}
            </ul>
        </section>
    );
}