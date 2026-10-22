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
