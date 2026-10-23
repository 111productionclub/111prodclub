import shutil
import tempfile
from io import BytesIO
from pathlib import Path

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from PIL import Image

from .models import Case, CaseImage

MEDIA = tempfile.mkdtemp()


def upload(width, height, color="red", name="photo.jpg"):
    buffer = BytesIO()
    Image.new("RGB", (width, height), color).save(buffer, "JPEG")
    return SimpleUploadedFile(name, buffer.getvalue(), content_type="image/jpeg")


@override_settings(MEDIA_ROOT=MEDIA)
class CaseImageTests(TestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(MEDIA, ignore_errors=True)

    def setUp(self):
        self.case = Case.objects.create(
            slug="test", number="01", title="Тест", kind="лендинг", category="sites", year="2026",
            summary="Кратко", tags="лендинг, Django",
        )

    def test_three_webp_sizes(self):
        photo = CaseImage.objects.create(case=self.case, image=upload(2400, 1200))
        self.assertEqual(photo.widths, [480, 960, 1600])
        self.assertEqual((photo.width, photo.height), (2400, 1200))
        self.assertTrue(photo.image.name.endswith("-1600.webp"))
        for name, width in photo.variants():
            with Image.open(Path(MEDIA) / name) as saved:
                self.assertEqual(saved.format, "WEBP")
                self.assertEqual(saved.size, (width, width // 2))
        self.assertFalse(list(Path(MEDIA).rglob("*.jpg")), "оригинал не должен сохраняться")

    def test_small_photo_not_upscaled(self):
        photo = CaseImage.objects.create(case=self.case, image=upload(300, 200, "blue"))
        self.assertEqual(photo.widths, [300])

    def test_same_photo_same_files(self):
        first = CaseImage.objects.create(case=self.case, image=upload(1000, 500, "green"))
        second = CaseImage.objects.create(case=self.case, image=upload(1000, 500, "green", "copy.jpg"))
        self.assertEqual(first.image.name, second.image.name)

    def test_api(self):
        CaseImage.objects.create(case=self.case, image=upload(2000, 1000))
        Case.objects.create(
            slug="hidden", number="02", title="Скрыт", kind="сайт", category="sites", year="2026",
            summary="—", is_published=False,
        )

        cases = self.client.get("/api/cases/").json()
        self.assertEqual([item["slug"] for item in cases], ["test"])
        self.assertEqual(cases[0]["tags"], ["лендинг", "Django"])
        cover = cases[0]["cover"]
        self.assertTrue(cover["src"].startswith("/media/cases/"))
        self.assertEqual([entry.split()[1] for entry in cover["srcset"].split(", ")], ["480w", "960w", "1600w"])

        detail = self.client.get("/api/cases/test/").json()
        self.assertIsNone(detail["quote"])
        self.assertEqual(len(detail["images"]), 1)
        self.assertEqual(self.client.get("/api/cases/hidden/").status_code, 404)
        self.assertEqual(len(self.client.get("/api/cases/?category=merch").json()), 0)
