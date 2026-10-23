import { Suspense } from "react";
import { notFound } from "next/navigation";
import { shopEnabled } from "@/lib/flags";
import Header from "@/components/Header";
import SectionLabel from "@/components/SectionLabel";
import CategoryFilter, { type FilterCategory } from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";

type SearchParams = Promise<{ category?: string }>;

const categories: FilterCategory[] = [
    { label: "Все" },
    { label: "Футболки", slug: "tshirts" },
    { label: "Худи", slug: "hoodies" },
    { label: "Аксессуары", slug: "accessories" },
];

function itemsCount(count: number) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    const word =
        mod10 === 1 && mod100 !== 11 ? "вещь" : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? "вещи" : "вещей";
    return `${String(count).padStart(2, "0")} ${word}`;
}

async function Catalog({ searchParams }: { searchParams: SearchParams }) {
    const { category } = await searchParams;
    const products = await getProducts(category);

    return (
        <>
            <div className="flex items-end justify-between">
                <div>
                    <SectionLabel>/ мерч — {itemsCount(products.length)}</SectionLabel>
                    <h1 className="mt-4 text-hero">Мерч</h1>
                </div>
                <CategoryFilter categories={categories} basePath="/merch" active={category} />
            </div>
            {products.length > 0 ? (
                <div className="mt-24 grid grid-cols-3 gap-x-8 gap-y-14">
                    {products.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                    ))}
                </div>
            ) : (
                <p className="mt-24 text-h3 text-white/50">В этой категории пока ничего нет</p>
            )}
        </>
    );
}

export default function MerchPage({ searchParams }: { searchParams: SearchParams }) {
    if (!shopEnabled) {
        notFound();
    }
    return (
        <>
            <Header />
            <main className="px-[104px] pb-32 pt-24">
                <Suspense fallback={<p className="text-h3 text-white/50">Загружаем…</p>}>
                    <Catalog searchParams={searchParams} />
                </Suspense>
            </main>
        </>
    );
}
