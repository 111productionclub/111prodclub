const API_URL = process.env.API_URL ?? "http://localhost:8000";
// Адрес, с которого браузер берёт фото. Пустая строка = тот же домен (/media/ отдаёт Caddy)
const MEDIA_URL = process.env.MEDIA_URL ?? API_URL;

export type CaseCategory = "sites" | "backend" | "merch";

export type CaseImage = {
    src: string
    srcset: string
    width: number | null
    height: number | null
    caption: string
}

export type Case = {
    slug: string
    number: string
    title: string
    kind: string
    year: string
    summary: string
    tags: string[]
    category: CaseCategory
    cover: CaseImage | null
}

export type CaseDetail = Case & {
    client: string
    work: string
    duration: string
    url: string
    task: string
    solution: string
    video: string | null
    images: CaseImage[]
    metrics: { value: string; label: string }[]
    quote: { text: string; author: string } | null
}

const empty = { cover: null, client: "", work: "", duration: "", url: "", task: "", solution: "", images: [], video: null, metrics: [], quote: null };

// Запасной список, если бэкенд недоступен (сейчас на сервере он не развёрнут).
// Кейсы и фото добавляются в админке Django, этот список их не заменяет.
const fallback: CaseDetail[] = [
    {
        ...empty,
        slug: "my-new-era",
        number: "01",
        title: "my new era",
        kind: "лендинг",
        year: "2026",
        summary: "Лендинг для бренда одежды: дроп, лукбук, переход в магазин.",
        tags: ["лендинг", "дизайн", "Django"],
        category: "sites",
        client: "my new era, бренд одежды",
        work: "Дизайн, вёрстка, бэкенд",
    },
    {
        ...empty,
        slug: "savelifeenergy",
        number: "02",
        title: "savelifeenergy",
        kind: "бэкенд",
        year: "2026",
        summary: "Перевели интернет-магазин на новый бэкенд.",
        tags: ["e-commerce", "бэкенд", "Django"],
        category: "backend",
    },
    {
        ...empty,
        slug: "111cult",
        number: "03",
        title: "111cult",
        kind: "сайт",
        year: "2026",
        summary: "Наш собственный сайт: шифр с промокодом, мерч и кабинет клиента со статистикой.",
        tags: ["сайт", "интерактив", "Django"],
        category: "sites",
    },
    {
        ...empty,
        slug: "merch-iii",
        number: "04",
        title: "Мерч III",
        kind: "мерч",
        year: "2026",
        summary: "Футболка студии: terrorize yourself / stay terrified. Дизайн и производство.",
        tags: ["мерч", "айдентика"],
        category: "merch",
    },
];

function withMedia(image: CaseImage): CaseImage {
    return {
        ...image,
        src: MEDIA_URL + image.src,
        srcset: image.srcset
            .split(", ")
            .map((entry) => MEDIA_URL + entry)
            .join(", "),
    };
}

// undefined = бэкенд недоступен, тогда берём запасной список
async function request<T>(path: string): Promise<T | null | undefined> {
    try {
        const res = await fetch(`${API_URL}/api${path}`, { signal: AbortSignal.timeout(3000) });
        if (res.status === 404) {
            return null;
        }
        return res.ok ? await res.json() : undefined;
    } catch {
        return undefined;
    }
}

export async function getCases(): Promise<Case[]> {
    const data = await request<Case[]>("/cases/");
    if (!data) {
        return fallback;
    }
    return data.map((item) => ({ ...item, cover: item.cover && withMedia(item.cover) }));
}

export async function getCase(slug: string): Promise<CaseDetail | null> {
    const data = await request<CaseDetail>(`/cases/${encodeURIComponent(slug)}/`);
    if (data === undefined) {
        return fallback.find((item) => item.slug === slug) ?? null;
    }
    if (data === null) {
        return null;
    }
    return {
        ...data,
        cover: data.cover && withMedia(data.cover),
        video: data.video && MEDIA_URL + data.video,
        images: data.images.map(withMedia),
    };
}
