import SectionLabel from "./SectionLabel";


type Step = {
    number: string;
    title: string;
    text: string;
    duration: string;
};
const steps: Step[] = [
    {
        number: "01",
        title: "Бриф",
        text: "Созваниваемся, разбираем задачу, фиксируем что делаем и к какому сроку.",
        duration: "1 день",
    },
    {
        number: "02",
        title: "Дизайн",
        text: "Собираем макет, показываем, вносим правки до того, как писать код.",
        duration: "2–4 дня",
    },
    {
        number: "03",
        title: "Разработка",
        text: "Без конструкторов. Показываем промежуточный результат.",
        duration: "3–10 дней",
    },
    {
        number: "04",
        title: "Запуск",
        text: "Выкатываем на свой сервер и остаёмся рядом: хостинг, правки, поддержка.",
        duration: "+ поддержка",
    }
];

export default function Process() {
    return (
        <section id="process" className="px-5 py-16 md:px-[104px] md:py-24">
            <SectionLabel>
                / 01 — как мы работаем
            </SectionLabel>
            <h2 className="text-h1 mt-2">От идеи до запуска</h2>

            <ol className="mt-8 md:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-x-24 md:gap-y-12 lg:gap-y-0">
                {steps.map((step) => (
                    <li key={step.number} className="border-t border-white/30 pt-5 pb-7 md:pb-0">
                        <div className="flex items-baseline gap-3 md:block">
                            <span className="text-sm md:text-h3 text-white/50">{step.number}</span>
                            <h3 className="text-h3 md:text-base md:tracking-normal font-medium">{step.title}</h3>
                        </div>
                        <p className="mt-2.5 text-sm md:mt-3 md:text-xs text-white/50">{step.text}</p>
                        <p className="mt-2.5 md:mt-6 font-medium">{step.duration}</p>
                    </li>
                ))}
            </ol>
        </section>
    );
}