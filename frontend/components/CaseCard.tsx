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
            <div className={`relative overflow-hidden rounded-lg bg-[#141414] ${featured ? "aspect-[1072/467]" : "aspect-[4/3]"}`}>
                {item.cover ? (
                    <CasePhoto
                        image={item.cover}
                        alt={item.title}
                        sizes={featured ? "(min-width: 1280px) 1072px, 100vw" : "(min-width: 1280px) 520px, 50vw"}
                        preload={featured}
                        className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-white/30">
                        [ скрин / видео проекта ]
                    </span>
                )}
                <span className="absolute left-6 top-6 font-mono text-xs text-white/40">{item.number}</span>
            </div>
            <div className="mt-5 flex items-baseline justify-between">
                <h2 className="text-4xl font-light tracking-tight group-hover:underline">{item.title}</h2>
                <span className="font-mono text-xs text-white/50">{item.year}</span>
            </div>
            <p className="mt-3 max-w-[480px] text-sm text-white/70">{item.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-white/30 px-3 py-1 font-mono text-xs text-white/70">
                        {tag}
                    </li>
                ))}
            </ul>
        </Link>
    );
}
