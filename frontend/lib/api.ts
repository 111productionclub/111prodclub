const API_URL = process.env.API_URL ?? "http://localhost:8000";

export type ProductStatus = "new" | "soon" | "regular";

export type ProductSize = {
    label: string
    stock: number
}

export type Product = {
    slug: string
    sku: string
    title: string
    price: string
    category: string
    status: ProductStatus
    sizes: ProductSize[]
    sold_out: boolean
    cover: string | null
}

export async function getProducts(category?: string): Promise<Product[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    const res = await fetch(`${API_URL}/api/products/${query}`);
    if (!res.ok) {
        throw new Error(`Не удалось загрузить товары: ${res.status}`);
    }
    return res.json();
}
