import SectionLabel from "./SectionLabel";
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
        <section className="grid grid-cols-[1fr_2fr] gap-x-24 px-[104px] py-24">
            <div>
                <SectionLabel>/ 02 — сроки</SectionLabel>
                <h2 className="mt-2 text-[80px] leading-none">Сколько</h2>
                <h2 className="mt-2 text-[80px] leading-none">ждать</h2>
            </div>


            <ul>
                {items.map(
                    (item) => (
                        <li key={item.title} className="flex items-center justify-between py-6">
                            <span className="text-2xl">{item.title}</span>
                            <span className="text-xs text-white/50">{item.duration}</span>
                        </li>
                    ))}
            </ul>
        </section>
    );
}