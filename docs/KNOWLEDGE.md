# База знаний проекта

Сюда Claude добавляет короткие записи после каждой задачи: что за концепция, как это сделано у нас, на что легко наступить. Формат записи:

```
## Название темы
- Что это:
- Как у нас: (файл, пример)
- Частая ошибка:
```

<!-- Записи ниже -->

## Каркас бэкенда (Django + Postgres), 22.10.2026
Что сделано: папка `backend/` с Django 6 + DRF, Postgres в Docker, кастомный `User`. Мерж в `main` выполнен. Модели товаров, API и миграции ещё впереди (см. `docs/BACKEND.md`, задачи 7-13 в `docs/TASKS.md`).

### На что обратить внимание
- **Миграции ещё не выполнены.** После клонирования или возвращения к работе: `cd backend`, `docker compose up -d`, `uv run python manage.py makemigrations users`, `uv run python manage.py migrate`. Файл миграции из `makemigrations` коммитим.
- **Кастомный `User` создаётся до первой `migrate`.** Файл `users/models.py`, строка `AUTH_USER_MODEL = "users.User"` в `settings.py`. Если выполнить `migrate` с обычным `User`, потом менять модель очень больно.
- **`.env` не коммитим никогда.** Он лежит в `backend/` (рядом с `docker-compose.yml`, Compose ищет его там), в git не попадает благодаря `backend/.gitignore`. В git лежит `.env.example` (ключи без значений). Новый `SECRET_KEY`: `uv run python -c "from django.core.management.utils import get_random_secret_key as g; print(g())"`. Старый ключ из шаблона Django считаем скомпрометированным, он есть в истории чата, но в коммит не попал.
- **`load_dotenv(BASE_DIR / ".env")` надо вызвать, а не только импортировать.** Без вызова `os.environ["SECRET_KEY"]` падает с `KeyError`.
- **Опечатки в настройках.** Движок БД: `django.db.backends.postgresql` (маленькими буквами). `TIME_ZONE = "Europe/Moscow"` (не `GMT+3`). Несуществующие настройки (например, `MAILERS`) Django молча игнорирует.
- **Курица и яйцо с `startapp`.** `startapp users` загружает настройки и падает, если в `INSTALLED_APPS` уже указано несуществующее приложение. Решение: временно закомментировать `'users'` и `AUTH_USER_MODEL`.
- **Docker на этой машине это OrbStack.** Если `docker ps` выдаёт «failed to connect to the docker API», открой OrbStack или выполни `orbctl start`.
- **После первого `docker compose up -d` подожди 5-10 секунд перед `migrate`.** Postgres при самом первом старте создаёт БД во временном сервере, выключает его и стартует заново. Если подключиться в это окно, будет `server closed the connection unexpectedly`. Проверка готовности: `docker compose logs db` должен заканчиваться строкой «ready to accept connections». Просто повтори `migrate`.
- **Volume в `docker-compose.yml` (`pgdata`)** хранит данные БД. Без него данные пропадут при пересоздании контейнера.

### Git: что пошло не так
- Команды `git add backend ...` выполняй из **корня репозитория**. В `backend/` путь `backend` не существует: `git add` падает с `pathspec ... did not match`, а `git push` после этого отправляет пустую ветку без твоих файлов. Перед коммитом всегда смотри `git status`: файлы должны быть в зелёной секции «Changes to be committed».
- `.gitignore` с правилом `.env` без слэша игнорирует `.env` на любой глубине (так он поймал файл и в `config/`, и в `backend/`). Проверка: `git check-ignore -v <файл>`.
- `.gitignore` бывает у каждой части проекта свой (`frontend/.gitignore`, `backend/.gitignore`), в корне остаётся общее (`.DS_Store`).

### Открытые вопросы (решить до задачи 13)
- Платёжный провайдер (ЮKassa или аналог): нужны юрлицо/ИП и ключи.
- Сессии или JWT для авторизации.
- Макетов корзины, оформления заказа, логина и кабинета нет.

## API каталога и страница `/merch` (22.10.2026)
- **Сериализатор (DRF)** превращает модель в JSON. Файл `backend/shop/serializers.py`. Вычисляемые поля (`sold_out`, `cover`) делаются через `SerializerMethodField`, в БД они не хранятся. Для карточки товара `ProductDetailSerializer` наследуется от списка и добавляет поля.
- **N+1 запросов:** в `views.py` используем `select_related("category")` и `prefetch_related("sizes", "images")`. Без них на каждый товар шло бы по 3 лишних запроса в БД.
- **Деньги** отдаются строкой (`"2500.00"`, `DecimalField`), на фронте переводим в число и форматируем (`ProductCard.tsx`).
- **Next 16 + `cacheComponents`:** страница, которая читает `searchParams` или ходит в API, должна обернуть эту часть в `<Suspense>`, иначе ошибка «blocking route». Пример: `frontend/app/merch/page.tsx`. Страница синхронная и отдаёт каркас, а внутренний `Catalog` ждёт `searchParams` и данные.
- **Адрес API на фронте** берётся из `process.env.API_URL` (по умолчанию `http://localhost:8000`), см. `frontend/lib/api.ts`. На проде задать переменную окружения.
- **Что зашито и надо будет вынести:** список категорий в `CategoryFilter.tsx` (в API нет эндпоинта категорий) и фото товаров (заглушка, пока в API `cover = null`).
- **Грабли с git:** `git restore .` и `git clean -fd` безвозвратно стирают незакоммиченную работу. Коммить маленькими кусками сразу после того, как что-то заработало.
- **Django-команды** запускаются из `backend/`, а git из корня репозитория.
- **Чтобы увидеть сайт целиком:** два терминала, в одном `runserver` (бэкенд), в другом `pnpm dev` (фронт). Сидер тестовых вещей: `uv run python manage.py seed_shop`.

## Мобильная версия главной (24.10.2026, PR #31)
- **Mobile-first:** класс без префикса работает на всех ширинах, `md:` включается от 768px, `lg:` от 1024px и перебивает класс без префикса. Пишем мобильное значение без префикса, а десктопное прячем под префикс: `px-5 md:px-[104px]`. Так десктоп остаётся прежним.
- **Какой префикс брать:** шрифты и отступы переключаем через `md:` (так же сделаны `Header.tsx` и `Footer.tsx`). Раскладку в колонки через `lg:`: на 768px две колонки с отступами 104px слишком узкие, «Сколько ждать» и «7 дней» вылезают и дают горизонтальный скролл. Пример: `grid-cols-1 lg:grid-cols-[1fr_2fr]` в `Timeline.tsx`.
- **Мобильные токены** в `app/globals.css`: `text-hero-m`, `text-display-m`, `text-display-xl-m`. Токен это три переменные (`--text-x`, `--text-x--line-height`, `--text-x--letter-spacing`), а не одна строка.
- **Ловушка с `tracking`:** если у мобильного токена есть letter-spacing, а у десктопного нет (`text-display-m md:text-display`), мобильный letter-spacing остаётся и на десктопе. Лечится `md:tracking-normal`.
- **Опечатки в классах** (`md:text-lead.`, `lg:gap-y-0:`, `text-black/50.`) Tailwind молча игнорирует: ошибок нет, просто не работает стиль. Ловит расширение Tailwind CSS IntelliSense.
- **Текст в flex-строке:** чтобы длинное название не вытолкнуло срок за край экрана, у названия `min-w-0`, у срока `shrink-0 whitespace-nowrap` (`Timeline.tsx`).
- **Как найти, кто даёт горизонтальный скролл:** в консоли DevTools `[...document.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > innerWidth)`. Ширины для проверки: 360, 390, 768, 1280 (Device Toolbar, Ctrl+Shift+M).
- **`SectionLabel`** общий для главной, `/works` и `/merch`: правка размера в нём меняет все страницы.
- Мобильные макеты: в Figma фреймы `Mobile 375 — Главная / Работы / Кейс`, в `Assets/screens/` их нет.
