"""Оптимизация загруженных фото кейсов.

Каждое фото сохраняется в WebP трёх размеров (ширина 480, 960, 1600px),
маленькие фото не увеличиваются. Имя файла = хеш содержимого оригинала,
поэтому одинаковые фото не дублируются, а файлы можно кешировать навсегда.
Оригинал не хранится.
"""

import hashlib
from io import BytesIO

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from PIL import Image, ImageOps

WIDTHS = (480, 960, 1600)
QUALITY = 80
FOLDER = "cases"


def variant_name(key, width):
    return f"{FOLDER}/{key}-{width}.webp"


def optimize(file):
    """Делает варианты в хранилище, возвращает (key, width, height, widths)."""
    file.seek(0)
    data = file.read()
    key = hashlib.sha256(data).hexdigest()[:16]

    with Image.open(BytesIO(data)) as source:
        image = ImageOps.exif_transpose(source)
        has_alpha = image.mode in ("RGBA", "LA") or "transparency" in image.info
        image = image.convert("RGBA" if has_alpha else "RGB")
        width, height = image.size
        widths = sorted({min(target, width) for target in WIDTHS})

        for target in widths:
            name = variant_name(key, target)
            if default_storage.exists(name):
                continue
            resized = image
            if target != width:
                resized = image.resize((target, round(height * target / width)), Image.Resampling.LANCZOS)
            buffer = BytesIO()
            resized.save(buffer, "WEBP", quality=QUALITY, method=6)
            default_storage.save(name, ContentFile(buffer.getvalue()))

    return key, width, height, widths
