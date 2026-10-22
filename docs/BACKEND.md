# Бэкенд: стек, модели, API

Решения (22.10.2026): **Django + Django REST Framework**, **PostgreSQL в Docker**, код в `backend/`, онлайн-оплата сразу.

## Стек
- Python 3.14, менеджер зависимостей `uv`.
- Django + DRF, `django-cors-headers` (фронт на :3000, бэк на :8000), `psycopg` для Postgres.
- Авторизация: сессии или JWT. **Открытый вопрос**, решить до задачи 13. Для Next.js проще httpOnly-cookie с сессией.
- Оплата: провайдер **не выбран** (ЮKassa или аналог). Нужны юрлицо/ИП и ключи магазина, это блокер, выяснить сразу. Архитектура: `POST /orders` создаёт заказ со статусом `pending`, возвращает ссылку на оплату; провайдер дёргает вебхук `POST /payments/webhook`, заказ становится `paid`. Статус заказа меняем только по вебхуку, никогда по запросу с фронта.
- Админка Django (`/admin`) закрывает управление товарами, остатками и заказами.

## Модели

| Модель | Поля |
|---|---|
| Category | `slug`, `title` (футболки, худи, аксессуары) |
| Product | `slug`, `sku` («III / 001»), `title`, `description`, `price` (Decimal, ₽), `category` FK, `status` (`new` / `soon` / `regular`), `delivery_text`, `created_at` |
| ProductImage | `product` FK, `image`, `caption` (спина / перед / на человеке / деталь), `order` |
| ProductSize | `product` FK, `label` (S, M, L, XL, `one size`), `stock` (int) |
| PromoCode | `code`, `discount_percent`, `is_active`, `expires_at`, `max_uses`, `used_count` |
| Cart | `user` FK (null) или `session_key`, `created_at` |
| CartItem | `cart` FK, `size` FK→ProductSize, `quantity` |
| Order | `user` FK, `status` (`pending` / `paid` / `shipped` / `done` / `cancelled`), `total`, `promo` FK (null), `contact`, `delivery_address`, `delivery_method`, `payment_id` |
| OrderItem | `order` FK, `size` FK, `quantity`, `price` (цена **на момент заказа**, копируем, не ссылаемся на Product.price) |
| User | кастомный `AbstractUser` с email-логином. **Завести до первой миграции**, потом менять больно |

Статус «sold out» на макете **не хранится**: это вычисляется (`sum(stock) == 0`). Не дублируем.

## Эндпоинты (v1)

| Метод | Путь | Для страницы |
|---|---|---|
| GET | `/api/products/?category=` | `/merch` |
| GET | `/api/products/{slug}/` | `/merch/[slug]`, включая картинки и размеры с остатками |
| GET | `/api/products/?status=soon` | блок «следующий дроп» |
| POST | `/api/promo/check/` | блок «есть промокод?» |
| GET/POST/PATCH/DELETE | `/api/cart/...` | корзина, счётчик в шапке |
| POST | `/api/orders/` | оформление, возвращает ссылку на оплату |
| POST | `/api/payments/webhook/` | вебхук провайдера |
| POST | `/api/auth/login/`, `/logout/`, GET `/api/auth/me/` | `/login` |
| GET | `/api/account/stats/` | кабинет клиента (**макета нет**) |

## Подводные камни
- Остатки: при создании заказа уменьшать `stock` внутри транзакции с `select_for_update()`, иначе два покупателя заберут последнюю вещь.
- Цену и скидку всегда считаем на бэке, фронтовым числам не верим.
- Медиафайлы: на старте `MEDIA_ROOT` локально, на проде вынести в объектное хранилище.
- Фото товаров в макетах пока плейсхолдеры: поле `image` делаем необязательным, фронт показывает заглушку `[ фото вещи ]`.

## Порядок работы (см. TASKS.md, #7–13)
1. `backend/`, виртуальное окружение, Docker Compose с Postgres, кастомный User, первая миграция.
2. Модели Product / ProductImage / ProductSize / Category + админка + тестовые данные (6 вещей из макета).
3. `GET /products`, `GET /products/{slug}` → верстка `/merch`, `/merch/[slug]`.
4. Корзина, промокод, заказ, оплата, логин, кабинет.
