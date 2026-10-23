from django.core.files.storage import default_storage
from django.core.management.base import BaseCommand

from cases.images import make_variants, variant_name
from cases.models import CaseImage


class Command(BaseCommand):
    help = "Пересобирает WebP-варианты всех фото кейсов по текущим настройкам cases/images.py"

    def handle(self, *args, **options):
        without_original = []
        for photo in CaseImage.objects.select_related("case"):
            if photo.original and default_storage.exists(photo.original):
                source = photo.original
            else:
                # Фото загружено до того, как начали хранить оригиналы: берём самый крупный вариант
                source = photo.image.name
                without_original.append(f"{photo.case.title} (фото #{photo.pk})")

            with default_storage.open(source, "rb") as file:
                data = file.read()
            width, height, widths = make_variants(data, photo.key, force=True)

            photo.widths = widths
            photo.image.name = variant_name(photo.key, widths[-1])
            if source == photo.original:
                photo.width, photo.height = width, height
            photo.save(update_fields=["widths", "image", "width", "height"])

        self.stdout.write(self.style.SUCCESS(f"Готово: {CaseImage.objects.count()} фото"))
        if without_original:
            self.stdout.write(self.style.WARNING(
                "Без оригинала, качество не выше прежнего. Загрузи эти фото заново в админке:\n  "
                + "\n  ".join(without_original)
            ))
