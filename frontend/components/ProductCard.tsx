import Link from "next/link";
import type { Product } from "@/lib/api";

type ProductCardProps = {
    product: Product
};

const statusLabels = {
    new: "новинка",
    soon: "скоро",
    regular: null,
};

function formatPrice(price: string) {
    return `${Number(price).toLocaleString("ru-RU")} ₽`;
}

export default function ProductCard({ product }: ProductCardProps) {
    const badge = product.sold_out ? "sold out" : statusLabels[product.status];
    const sizes = product.sizes.map((size) => size.label).join(" · ");

    return (
        <Link href={`/merch/${product.slug}`} className="group block">
            <div className={`relative aspect-[336/420] rounded-lg ${product.sold_out ? "bg-[#0b0b0b]" : "bg-[#141414]"}`}>
                {badge && (
                    <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-sm ${
                            product.sold_out ? "bg-white/10 font-mono text-white/40" : "bg-white text-black"
                        }`}
                    >
                        {badge}
                    </span>
                )}
                <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-white/30">
                    [ фото вещи ]
                </span>
            </div>
            <div className={`mt-4 flex items-baseline justify-between ${product.sold_out ? "text-white/40" : ""}`}>
                <h2 className="text-xl font-light group-hover:underline">{product.title}</h2>
                <p className={product.sold_out ? "text-sm" : "text-sm text-white/50"}>
                    {product.sold_out ? "нет в наличии" : formatPrice(product.price)}
                </p>
            </div>
            <p className="mt-2 font-mono text-xs text-white/40">{sizes}</p>
        </Link>
    );
}
