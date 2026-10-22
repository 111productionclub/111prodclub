from decimal import Decimal

from django.core.management.base import BaseCommand

from shop.models import Category, Product, ProductSize

CATEGORIES = [
    ("tshirts", "Футболки"),
    ("hoodies", "Худи"),
    ("accessories", "Аксессуары"),
]

SIZES = ["S", "M", "L", "XL"]

# slug, sku, title, category, status, size labels, stock per size
PRODUCTS = [
    ("futbolka-iii", "III / 001", "Футболка III", "tshirts", "new", SIZES, 10),
    ("veshch-02", "III / 002", "[Вещь 02]", "tshirts", "new", SIZES, 10),
    ("veshch-03", "III / 003", "[Вещь 03]", "hoodies", "soon", ["S", "M", "L"], 5),
    ("veshch-04", "III / 004", "[Вещь 04]", "accessories", "soon", ["one size"], 5),
    ("veshch-05", "III / 005", "[Вещь 05]", "hoodies", "regular", SIZES, 0),
    ("veshch-06", "III / 006", "[Вещь 06]", "accessories", "regular", ["one size"], 0),
]


class Command(BaseCommand):
    help = "Создаёт тестовые категории и товары из макета мерча"

    def handle(self, *args, **options):
        categories = {}
        for slug, title in CATEGORIES:
            categories[slug], _ = Category.objects.get_or_create(slug=slug, defaults={"title": title})

        for slug, sku, title, category, status, sizes, stock in PRODUCTS:
            product, _ = Product.objects.update_or_create(
                slug=slug,
                defaults={
                    "sku": sku,
                    "title": title,
                    "category": categories[category],
                    "status": status,
                    "price": Decimal("2500.00"),
                    "description": "Чёрная футболка. [Состав, плотность ткани]",
                    "delivery_text": "[Как отдаёте: СДЭК, самовывоз в Москве, сроки]",
                },
            )
            for label in sizes:
                ProductSize.objects.update_or_create(product=product, label=label, defaults={"stock": stock})

        self.stdout.write(self.style.SUCCESS(f"Готово: {Product.objects.count()} товаров"))
