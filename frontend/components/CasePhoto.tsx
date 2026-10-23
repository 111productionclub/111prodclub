import type { CaseImage } from "@/lib/cases";

type CasePhotoProps = {
    image: CaseImage
    sizes: string
    alt: string
    className?: string
    preload?: boolean
};

// Фото уже оптимизированы на бэкенде (WebP трёх размеров), поэтому обычный <img> со srcset:
// next/image оптимизировал бы их второй раз
export default function CasePhoto({ image, sizes, alt, className = "", preload = false }: CasePhotoProps) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={image.src}
            srcSet={image.srcset}
            sizes={sizes}
            width={image.width ?? undefined}
            height={image.height ?? undefined}
            alt={alt}
            loading={preload ? "eager" : "lazy"}
            decoding="async"
            className={`object-cover ${className}`}
        />
    );
}
