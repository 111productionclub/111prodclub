import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SectionLabel from "@/components/SectionLabel";
import ProductBuy from "@/components/ProductBuy";
import ProductCard from "@/components/ProductCard";
import { getProduct, getProducts } from "@/lib/api";
import { formatPrice } from "@/lib/format";

type Params = Promise<{ slug: string }>;

const thumbCaptions = ["перед", "на человеке", "деталь"];

function Placeholder({ text, className }: { text: string; className: string }) {
    return (
        <div className={`relative rounded-lg bg-[#141414] ${className}`}>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-white/30">
                [ {text} ]
            </span>
        </div>
    );
}

async function Product({ params }: { params: Params }) {
    const { slug } = await params;
    const [product, all] = await Promise.all([getProduct(slug), getProducts()]);
    if (!product) {
        notFound();
    }

    const upcoming = all.filter((item) => item.status === "soon" && item.slug !== product.slug).slice(0, 2);
    const mainCaption = product.images[0]?.caption || "фото вещи";

    return (
        <>
            <p className="text-h3 text-white/50">
                <Link href="/merch" className="hover:text-white">
                    ← Весь мерч
                </Link>
                <span className="mx-3">/</span>
                {product.title}
            </p>

            <div className="mt-12 grid grid-cols-[582px_1fr] gap-12">
                <div>
                    <Placeholder text={mainCaption} className="aspect-[4/5]" />
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        {thumbCaptions.map((caption, index) => (
                            <Placeholder key={caption} text={product.images[index + 1]?.caption || caption} className="aspect-[4/5]" />
                        ))}
                    </div>
                </div>

                <div>
                    <p className="font-mono text-xs text-white/50">{product.sku}</p>
                    <h1 className="mt-3 text-5xl font-light tracking-tight">{product.title}</h1>
                    <p className="mt-4 text-2xl">{formatPrice(product.price)}</p>
                    <p className="mt-8 text-sm leading-relaxed text-white/70">{product.description}</p>

                    <ProductBuy product={product} />

                    <div className="mt-8 border-t border-white/30 pt-5">
                        <p className="font-mono text-xs text-white/50">есть промокод?</p>
                        <p className="mt-3 text-sm">Скидка спрятана в шифре на 111cult.ru</p>
                    </div>
                    <div className="mt-6 border-t border-white/30 pt-5">
                        <p className="font-mono text-xs text-white/50">доставка</p>
                        <p className="mt-3 text-sm text-white/70">{product.delivery_text}</p>
                    </div>
                </div>
            </div>

            {upcoming.length > 0 && (
                <section className="mt-40">
                    <SectionLabel>/ следующий дроп</SectionLabel>
                    <div className="mt-10 grid grid-cols-2 gap-8">
                        {upcoming.map((item) => (
                            <ProductCard key={item.slug} product={item} />
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}

export default function ProductPage({ params }: { params: Params }) {
    return (
        <>
            <Header />
            <main className="px-[104px] pb-32 pt-12">
                <Suspense fallback={<p className="text-h3 text-white/50">Загружаем…</p>}>
                    <Product params={params} />
                </Suspense>
            </main>
        </>
    );
}
