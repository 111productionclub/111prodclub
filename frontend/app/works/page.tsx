import { Suspense } from "react";
import Header from "@/components/Header";
import SectionLabel from "@/components/SectionLabel";
import CategoryFilter, { type FilterCategory } from "@/components/CategoryFilter";
import CaseCard from "@/components/CaseCard";
import CtaNextProject from "@/components/CtaNextProject";
import { getCases } from "@/lib/cases";

type SearchParams = Promise<{ category?: string }>;

const categories: FilterCategory[] = [
    { label: "Все" },
    { label: "Сайты", slug: "sites" },
    { label: "Бэкенд", slug: "backend" },
    { label: "Мерч", slug: "merch" },
];

async function Cases({ searchParams }: { searchParams: SearchParams }) {
    const { category } = await searchParams;
    const cases = await getCases();
    const list =category ? cases.filter((item) => item.category === category) : cases;
    const [first, ...rest] = list;

    return (
        <>
            <div className="flex flex-col items-start gap-7 md:flex-row md:items-end md:justify-between">
                <div>
                    <SectionLabel>/ работы — {String(list.length).padStart(2, "0")}</SectionLabel>
                    <h1 className="mt-2 text-hero-sm md:mt-4 md:text-hero">Кейсы</h1>
                </div>
                <CategoryFilter categories={categories} basePath="/works" active={category} />
            </div>

            {first ? (
                <div className="mt-10 space-y-12 md:mt-20 md:space-y-14">
                    <CaseCard item={first} featured />
                    {rest.length > 0 && (
                        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-8 md:gap-y-14">
                            {rest.map((item) => (
                                <CaseCard key={item.slug} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <p className="mt-10 text-h3 text-white/50 md:mt-20">В этой категории пока ничего нет</p>
            )}
        </>
    );
}

export default function WorksPage({ searchParams }: { searchParams: SearchParams }) {
    return (
        <>
            <Header />
            <main>
                <div className="px-5 pb-16 pt-12 md:px-[104px] md:pb-32 md:pt-24">
                    <Suspense fallback={<p className="text-h3 text-white/50">Загружаем…</p>}>
                        <Cases searchParams={searchParams} />
                    </Suspense>
                </div>
                <CtaNextProject />
            </main>
        </>
    );
}
