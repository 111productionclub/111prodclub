export type CaseCategory = "sites" | "backend" | "merch";

export type Case = {
    slug: string
    number: string
    title: string
    year: string
    summary: string
    tags: string[]
    category: CaseCategory
}

export const cases: Case[] = [
    {
        slug: "my-new-era",
        number: "01",
        title: "my new era",
        year: "2026",
        summary: "Лендинг для бренда одежды: дроп, лукбук, переход в магазин.",
        tags: ["лендинг", "дизайн", "Django"],
        category: "sites",
    },
    {
        slug: "savelifeenergy",
        number: "02",
        title: "savelifeenergy",
        year: "2026",
        summary: "Перевели интернет-магазин на новый бэкенд.",
        tags: ["e-commerce", "бэкенд", "Django"],
        category: "backend",
    },
    {
        slug: "111cult",
        number: "03",
        title: "111cult",
        year: "2026",
        summary: "Наш собственный сайт: шифр с промокодом, мерч и кабинет клиента со статистикой.",
        tags: ["сайт", "интерактив", "Django"],
        category: "sites",
    },
    {
        slug: "merch-iii",
        number: "04",
        title: "Мерч III",
        year: "2026",
        summary: "Футболка студии: terrorize yourself / stay terrified. Дизайн и производство.",
        tags: ["мерч", "айдентика"],
        category: "merch",
    },
];
