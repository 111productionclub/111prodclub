import Link from "next/link";

type Category = {
    label: string
    slug?: string
}

const categories: Category[] = [
    { label: "Все" },
    { label: "Футболки", slug: "tshirts" },
    { label: "Худи", slug: "hoodies" },
    { label: "Аксессуары", slug: "accessories" },
];

type CategoryFilterProps = {
    active?: string
};

export default function CategoryFilter({ active }: CategoryFilterProps) {
    return (
        <nav className="flex gap-2">
            {categories.map((category) => {
                const isActive = category.slug === active;
                return (
                    <Link
                        key={category.label}
                        href={category.slug ? `/merch?category=${category.slug}` : "/merch"}
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
