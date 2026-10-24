import Link from "next/link";
import CasePhoto from "@/components/CasePhoto";
import type { Case } from "@/lib/cases";

type CaseCardProps = {
    item: Case
    featured?: boolean
};

export default function CaseCard({ item, featured = false }: CaseCardProps) {
    return (
        <Link href={`/works/${item.slug}`} className="group block">
            <div className={`relative overflow-hidden rounded-lg bg-[#141414] ${featured ? "aspect-[4/3] md:aspect-[1072/467]" : "aspect-[4/3]"}`}>
                {item.cover ? (
                    <CasePhoto
                        image={item.cover}
                        alt={item.title}
                        // Реальная ширина в сетке /works: на телефоне экран минус px-5, на десктопе минус px-[104px] (и gap-x-8 между колонками)
                        sizes={
                            featured
                                ? "(max-width: 767px) calc(100vw - 40px), calc(100vw - 208px)"
                                : "(max-width: 767px) calc(100vw - 40px), calc((100vw - 240px) / 2)"
                        }
                        preload={featured}
                        className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-white/30">
                        [ скрин / видео проекта ]
                    </span>
                )}
                <span className="absolute left-4 top-4 font-mono text-xs text-white/40 md:left-6 md:top-6">{item.number}</span>
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
                <h2 className="text-lead leading-none font-light tracking-tight group-hover:underline md:text-4xl md:leading-10">{item.title}</h2>
                <span className="font-mono text-xs text-white/50">{item.year}</span>
            </div>
            <p className="mt-2.5 max-w-[480px] text-sm text-white/70 md:mt-3">{item.summary}</p>
            <ul className="mt-3.5 flex flex-wrap gap-2 md:mt-4">
                {item.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-white/30 px-3 py-1 font-mono text-xs text-white/70">
                        {tag}
                    </li>
                ))}
            </ul>
        </Link>
    );
}
