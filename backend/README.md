# Бэкенд (Django + DRF + PostgreSQL)

Нужен только чтобы открыть `/merch` на фронте. Для остальных страниц (главная, работы) бэкенд запускать не нужно.

## Что установить один раз
- **Docker** (на Mac: OrbStack или Docker Desktop). После запуска приложения команда `docker ps` должна работать без ошибок.
- **uv** (менеджер Python): https://docs.astral.sh/uv/getting-started/installation/ . Проверка: `uv --version`.

## Первый запуск
Все команды выполняются из папки `backend/`.

```bash
cd backend

# 1. Файл с настройками. Копируем пример и заполняем значения
cp .env.example .env
```
Открой `.env` и впиши значения после `=`:
```
SECRET_KEY=любая-длинная-случайная-строка
DEBUG=1
POSTGRES_DB=prodclub
POSTGRES_USER=prodclub
POSTGRES_PASSWORD=придумай-пароль
```
Файл `.env` в git не попадает, у каждого он свой. `SECRET_KEY` можно сгенерировать так:
```bash
uv run python -c "from django.core.management.utils import get_random_secret_key as g; print(g())"
```

```bash
# 2. Поставить зависимости
uv sync

# 3. Запустить базу данных (в Docker)
docker compose up -d
```
**Подожди 10 секунд**: при самом первом старте Postgres создаёт базу и перезапускается. Если выполнить следующую команду сразу, будет ошибка `server closed the connection unexpectedly`, тогда просто повтори.

```bash
# 4. Создать таблицы
uv run python manage.py migrate

# 5. Заполнить тестовыми товарами (6 вещей из макета) и кейсами (4 кейса со страницы /works)
uv run python manage.py seed_shop
uv run python manage.py seed_cases

# 6. Запустить сервер
uv run python manage.py runserver
```
Сервер работает, пока открыт этот терминал. Закрывать его нельзя.

## Кейсы в админке
Админка: http://localhost:8000/admin/ (пользователь создаётся командой `uv run python manage.py createsuperuser`), раздел **Кейсы**.
- Первое фото кейса = обложка карточки на `/works` и главный экран на странице кейса, остальные идут в галерею.
- Фото при сохранении конвертируются в WebP трёх размеров (640, 1280, 2560px, качество 88). Файлы лежат в `backend/media/cases/`, имя = хеш содержимого. Оригинал хранится в `media/cases/originals/`.
- Поменял размеры или качество в `cases/images.py`: `uv run python manage.py rebuild_case_images` пересоберёт все фото из оригиналов.
- Пустые поля (задача, метрики, цитата) на странице кейса просто не показываются.
- Без запущенного бэкенда фронт показывает запасной список из `frontend/lib/cases.ts` (без фото).

## Проверка
- http://localhost:8000/api/products/ должен показать список товаров в JSON.
- Фронт (`cd frontend && pnpm dev`, отдельный терминал) на http://localhost:3000/merch показывает каталог.

## Следующие запуски
```bash
cd backend
docker compose up -d          # если Docker был перезапущен
uv run python manage.py runserver
```
После `git pull`, если в коде появились новые модели: `uv run python manage.py migrate`.

## Админка
```bash
uv run python manage.py createsuperuser
```
Потом http://localhost:8000/admin : здесь добавляются категории и товары.

## Частые ошибки
| Ошибка | Причина |
|---|---|
| `can't open file '.../manage.py'` | команда запущена не из `backend/` |
| `KeyError: 'SECRET_KEY'` | нет файла `.env` или он лежит не в `backend/` |
| `server closed the connection unexpectedly` | Postgres ещё стартует, подожди 10 секунд и повтори |
| `failed to connect to the docker API` | не запущен Docker (OrbStack / Docker Desktop) |
| Фронт `/merch` показывает ошибку | не запущен `runserver` на порту 8000 |
