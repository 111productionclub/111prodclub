"""Оптимизация загруженных фото кейсов.

Каждое фото сохраняется в WebP трёх размеров (ширина 640, 1280, 2560px),
маленькие фото не увеличиваются. 2560 нужен для широких карточек на экранах
с двойной плотностью пикселей. Имя файла = хеш содержимого оригинала,
поэтому одинаковые фото не дублируются, а файлы можно кешировать навсегда.

Оригинал тоже сохраняется (cases/originals/): из него команда
`python manage.py rebuild_case_images` пересобирает варианты, если поменять размеры или качество.
"""

import hashlib
from io import BytesIO
from pathlib import PurePath

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from PIL import Image, ImageOps

WIDTHS = (640, 1280, 2560)
# Скриншоты сайтов: на тексте и тонких линиях при меньшем качестве видны артефакты
QUALITY = 88
FOLDER = "cases"


def variant_name(key, width):
    return f"{FOLDER}/{key}-{width}.webp"


def make_variants(data, key, force=False):
    """Пишет WebP-варианты в хранилище, возвращает (width, height, widths) исходника."""
    with Image.open(BytesIO(data)) as source:
        image = ImageOps.exif_transpose(source)
        has_alpha = image.mode in ("RGBA", "LA") or "transparency" in image.info
        image = image.convert("RGBA" if has_alpha else "RGB")
        width, height = image.size
        widths = sorted({min(target, width) for target in WIDTHS})

        for target in widths:
            name = variant_name(key, target)
            if default_storage.exists(name):
                if not force:
                    continue
                default_storage.delete(name)
            resized = image
            if target != width:
                resized = image.resize((target, round(height * target / width)), Image.Resampling.LANCZOS)
            buffer = BytesIO()
            resized.save(buffer, "WEBP", quality=QUALITY, method=6)
            default_storage.save(name, ContentFile(buffer.getvalue()))

    return width, height, widths


def optimize(file):
    """Сохраняет оригинал и делает варианты. Возвращает (key, original, width, height, widths)."""
    file.seek(0)
    data = file.read()
    key = hashlib.sha256(data).hexdigest()[:16]

    original = f"{FOLDER}/originals/{key}{PurePath(file.name).suffix.lower()}"
    if not default_storage.exists(original):
        default_storage.save(original, ContentFile(data))

    width, height, widths = make_variants(data, key)
    return key, original, width, height, widths
