import Link from "next/link";

export type FilterCategory = {
    label: string
    slug?: string
}

type CategoryFilterProps = {
    categories: FilterCategory[]
    basePath: string
    active?: string
};

export default function CategoryFilter({ categories, basePath, active }: CategoryFilterProps) {
    return (
        <nav className="flex gap-2">
            {categories.map((category) => {
                const isActive = category.slug === active;
                return (
                    <Link
                        key={category.label}
                        href={category.slug ? `${basePath}?category=${category.slug}` : basePath}
                        className={`rounded-full border px-5 py-3 text-sm ${
                            isActive ? "border-white bg-white text-black" : "border-white/30 hover:border-white"
                        }`}
                    >
                        {category.label}
                    </Link>
                );
            })}
        </nav>
    );
}
