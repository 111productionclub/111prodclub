import { Suspense } from "react";
import Header from "@/components/Header";
import SectionLabel from "@/components/SectionLabel";
import CategoryFilter, { type FilterCategory } from "@/components/CategoryFilter";
import CaseCard from "@/components/CaseCard";
import CtaNextProject from "@/components/CtaNextProject";
import { cases } from "@/lib/cases";

type SearchParams = Promise<{ category?: string }>;

const categories: FilterCategory[] = [
    { label: "Все" },
    { label: "Сайты", slug: "sites" },
    { label: "Бэкенд", slug: "backend" },
    { label: "Мерч", slug: "merch" },
];

async function Cases({ searchParams }: { searchParams: SearchParams }) {
    const { category } = await searchParams;
    const list = category ? cases.filter((item) => item.category === category) : cases;
    const [first, ...rest] = list;

    return (
        <>
            <div className="flex items-end justify-between">
                <div>
                    <SectionLabel>/ работы — {String(list.length).padStart(2, "0")}</SectionLabel>
                    <h1 className="mt-4 text-hero">Кейсы</h1>
                </div>
                <CategoryFilter categories={categories} basePath="/works" active={category} />
            </div>

            {first ? (
                <div className="mt-20 space-y-14">
                    <CaseCard item={first} featured />
                    {rest.length > 0 && (
                        <div className="grid grid-cols-2 gap-x-8 gap-y-14">
                            {rest.map((item) => (
                                <CaseCard key={item.slug} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <p className="mt-20 text-h3 text-white/50">В этой категории пока ничего нет</p>
            )}
        </>
    );
}

export default function WorksPage({ searchParams }: { searchParams: SearchParams }) {
    return (
        <>
            <Header />
            <main>
                <div className="px-[104px] pb-32 pt-24">
                    <Suspense fallback={<p className="text-h3 text-white/50">Загружаем…</p>}>
                        <Cases searchParams={searchParams} />
                    </Suspense>
                </div>
                <CtaNextProject />
            </main>
        </>
    );
}
