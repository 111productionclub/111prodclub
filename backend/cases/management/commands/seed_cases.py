from django.core.management.base import BaseCommand

from cases.models import Case

# Те же 4 кейса, что в макете и в frontend/lib/cases.ts. Фото добавляются в админке
CASES = [
    {
        "slug": "my-new-era", "number": "01", "title": "my new era", "kind": "лендинг", "category": "sites",
        "summary": "Лендинг для бренда одежды: дроп, лукбук, переход в магазин.",
        "tags": "лендинг, дизайн, Django", "client": "my new era, бренд одежды", "work": "Дизайн, вёрстка, бэкенд",
    },
    {
        "slug": "savelifeenergy", "number": "02", "title": "savelifeenergy", "kind": "бэкенд", "category": "backend",
        "summary": "Перевели интернет-магазин на новый бэкенд.",
        "tags": "e-commerce, бэкенд, Django",
    },
    {
        "slug": "111cult", "number": "03", "title": "111cult", "kind": "сайт", "category": "sites",
        "summary": "Наш собственный сайт: шифр с промокодом, мерч и кабинет клиента со статистикой.",
        "tags": "сайт, интерактив, Django",
    },
    {
        "slug": "merch-iii", "number": "04", "title": "Мерч III", "kind": "мерч", "category": "merch",
        "summary": "Футболка студии: terrorize yourself / stay terrified. Дизайн и производство.",
        "tags": "мерч, айдентика",
    },
]


class Command(BaseCommand):
    help = "Создаёт 4 кейса из макета (без фото). Уже существующие не перезаписывает"

    def handle(self, *args, **options):
        created = 0
        for order, data in enumerate(CASES):
            _, is_new = Case.objects.get_or_create(
                slug=data["slug"], defaults={**data, "year": "2026", "order": order}
            )
            created += is_new
        self.stdout.write(self.style.SUCCESS(f"Готово: создано {created}, всего кейсов {Case.objects.count()}"))
