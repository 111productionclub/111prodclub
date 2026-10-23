from django.db import models

from .images import optimize, variant_name


class Case(models.Model):
    class Category(models.TextChoices):
        SITES = "sites", "Сайты"
        BACKEND = "backend", "Бэкенд"
        MERCH = "merch", "Мерч"

    slug = models.SlugField(unique=True)
    number = models.CharField("номер", max_length=4, help_text="Как на сайте: 01, 02…")
    title = models.CharField("название", max_length=200)
    kind = models.CharField("тип", max_length=50, help_text="Подпись «/ кейс 01 — лендинг»")
    category = models.CharField("фильтр", max_length=10, choices=Category.choices)
    year = models.CharField("год", max_length=4)
    summary = models.TextField("кратко", help_text="Текст под карточкой на /works")
    tags = models.CharField("теги", max_length=200, blank=True, help_text="Через запятую: лендинг, дизайн, Django")
    client = models.CharField("клиент", max_length=200, blank=True)
    work = models.CharField("что делали", max_length=200, blank=True)
    duration = models.CharField("срок", max_length=100, blank=True)
    url = models.URLField("ссылка на проект", blank=True)
    task = models.TextField("задача", blank=True)
    solution = models.TextField("решение", blank=True)
    quote_text = models.TextField("цитата клиента", blank=True, help_text="Только если клиент сам её дал")
    quote_author = models.CharField("автор цитаты", max_length=200, blank=True)
    order = models.PositiveSmallIntegerField("порядок", default=0)
    is_published = models.BooleanField("опубликован", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "number"]
        verbose_name = "кейс"
        verbose_name_plural = "кейсы"

    def __str__(self):
        return self.title

    @property
    def tag_list(self):
        return [tag.strip() for tag in self.tags.split(",") if tag.strip()]


class CaseImage(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField("фото", upload_to="cases/")
    caption = models.CharField("подпись", max_length=100, blank=True, help_text="Первое фото — обложка и главный экран")
    order = models.PositiveSmallIntegerField("порядок", default=0)
    key = models.CharField(max_length=16, editable=False)
    width = models.PositiveIntegerField(null=True, editable=False)
    height = models.PositiveIntegerField(null=True, editable=False)
    widths = models.JSONField(default=list, editable=False)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "фото"
        verbose_name_plural = "фото"

    def save(self, *args, **kwargs):
        # Новый файл из формы ещё не сохранён (_committed=False): вместо оригинала
        # пишем WebP-варианты, а в поле оставляем самый крупный из них.
        if self.image and not self.image._committed:
            self.key, self.width, self.height, self.widths = optimize(self.image.file)
            self.image.name = variant_name(self.key, self.widths[-1])
            self.image._committed = True
        super().save(*args, **kwargs)

    def variants(self):
        return [(variant_name(self.key, width), width) for width in self.widths]


class CaseMetric(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name="metrics")
    value = models.CharField("значение", max_length=20, help_text="Например: 7 или 2×")
    label = models.CharField("подпись", max_length=100, help_text="Например: дней до запуска")
    order = models.PositiveSmallIntegerField("порядок", default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "метрика"
        verbose_name_plural = "метрики результата"
