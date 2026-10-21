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
        <section id="process" className="px-[104px] py-24">
            <SectionLabel>
                / 01 — как мы работаем
            </SectionLabel>
            <h2 className="text-h1 mt-2">От идеи до запуска</h2>

            <ol className="mt-14 grid grid-cols-4 gap-x-24">
                {steps.map((step) => (
                    <li key={step.number} className="border-t border-white/30 pt-5">
                        <span className="text-h3 text-white/50">{step.number}</span>
                        <h3 className="font-medium">{step.title}</h3>
                        <p className="mt-3 text-xs text-white/50">{step.text}</p>
                        <p className="mt-6 font-medium">{step.duration}</p>
                    </li>
                ))}
            </ol>
        </section>
    );
}