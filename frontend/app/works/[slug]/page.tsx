import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SectionLabel from "@/components/SectionLabel";
import CasePhoto from "@/components/CasePhoto";
import { getCase, getCases } from "@/lib/cases";

type Params = Promise<{ slug: string }>;

async function CaseContent({ params }: { params: Params }) {
    const { slug } = await params;
    const [item, all] = await Promise.all([getCase(slug), getCases()]);
    if (!item) {
        notFound();
    }

    const index = all.findIndex((entry) => entry.slug === item.slug);
    const next = all.length > 1 ? all[(index + 1) % all.length] : null;
    const [hero, ...gallery] = item.images;

    const meta = [
        { label: "клиент", value: item.client },
        { label: "что делали", value: item.work },
        { label: "срок", value: item.duration },
    ].filter((entry) => entry.value);

    // Нумерация «01 — задача, 02 — решение, 03 — результат» только по заполненным блокам
    const story = [
        { label: "задача", text: item.task },
        { label: "решение", text: item.solution },
    ].filter((entry) => entry.text);
    const resultNumber = String(story.length + 1).padStart(2, "0");

    return (
        <>
            <div className="px-[104px] pb-32 pt-12">
                <Link href="/works" className="text-h3 text-white/50 hover:text-white">
                    ← Все работы
                </Link>

                <div className="mt-16">
                    <SectionLabel>
                        / кейс {item.number} — {item.kind}
                    </SectionLabel>
                    <h1 className="mt-4 text-display-xl">{item.title}</h1>
                </div>

                {(meta.length > 0 || item.url) && (
                    <dl className="mt-12 grid grid-cols-4 gap-6 border-t border-white/30 pt-6">
                        {meta.map((entry) => (
                            <div key={entry.label}>
                                <dt className="font-mono text-xs text-white/50">{entry.label}</dt>
                                <dd className="mt-2">{entry.value}</dd>
                            </div>
                        ))}
                        {item.url && (
                            <div>
                                <dt className="font-mono text-xs text-white/50">ссылка</dt>
                                <dd className="mt-2">
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {item.url.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
                                    </a>
                                </dd>
                            </div>
                        )}
                    </dl>
                )}

                <div className="relative mt-14 aspect-[2/1] overflow-hidden rounded-lg bg-[#141414]">
                    {hero ? (
                        <CasePhoto
                            image={hero}
                            alt={hero.caption || item.title}
                            sizes="calc(100vw - 208px)"
                            preload
                            className="absolute inset-0 h-full w-full"
                        />
                    ) : (
                        <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-white/30">
                            [ главный экран сайта — скрин или видео на всю ширину ]
                        </span>
                    )}
                </div>

                {story.length > 0 && (
                    <div className="mt-28 flex flex-col gap-20">
                        {story.map((entry, position) => (
                            <section key={entry.label} className="grid grid-cols-[240px_1fr] gap-16">
                                <h2 className="text-sm text-white/50">
                                    {String(position + 1).padStart(2, "0")} — {entry.label}
                                </h2>
                                <p className="whitespace-pre-line text-lead">{entry.text}</p>
                            </section>
                        ))}
                    </div>
                )}

                {gallery.length > 0 && (
                    <div className="mt-28 grid grid-cols-2 gap-6">
                        {gallery.map((image) => (
                            <figure key={image.src} className="relative aspect-[524/655] overflow-hidden rounded-lg bg-[#141414]">
                                <CasePhoto
                                    image={image}
                                    alt={image.caption || item.title}
                                    sizes="calc((100vw - 232px) / 2)"
                                    className="absolute inset-0 h-full w-full"
                                />
                            </figure>
                        ))}
                    </div>
                )}

                {item.metrics.length > 0 && (
                    <section className="mt-28 grid grid-cols-[240px_1fr] gap-16">
                        <h2 className="text-sm text-white/50">{resultNumber} — результат</h2>
                        <ul className="grid grid-cols-3 gap-8">
                            {item.metrics.map((metric) => (
                                <li key={metric.label} className="border-t border-white pt-4">
                                    <p className="text-display">{metric.value}</p>
                                    <p className="mt-3 text-xs text-white/50">{metric.label}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {item.quote && (
                    <figure className="mt-24 border-t border-white/30 pt-16">
                        <blockquote className="max-w-[1000px] text-lead">«{item.quote.text}»</blockquote>
                        {item.quote.author && <figcaption className="mt-6 text-xs text-white/50">{item.quote.author}</figcaption>}
                    </figure>
                )}
            </div>

            {next && (
                <section className="bg-white px-[104px] py-[72px] text-black">
                    <Link href={`/works/${next.slug}`} className="group flex items-center justify-between">
                        <div>
                            <p className="font-mono text-xs opacity-50">следующий кейс</p>
                            <p className="mt-3 text-display group-hover:underline">{next.title}</p>
                        </div>
                        <svg className="size-14 transition-transform group-hover:translate-x-2" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M11.6665 28H44.3332M30.3332 42L44.3332 28L30.3332 14" stroke="currentColor" strokeWidth="2.8" />
                        </svg>
                    </Link>
                </section>
            )}
        </>
    );
}

export default function CasePage({ params }: { params: Params }) {
    return (
        <>
            <Header />
            <main>
                <Suspense fallback={<p className="px-[104px] pt-12 text-h3 text-white/50">Загружаем…</p>}>
                    <CaseContent params={params} />
                </Suspense>
            </main>
        </>
    );
}
