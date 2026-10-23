# Деплой на сервер студии

Сайт работает за общим Caddy (`edge-caddy`) в сети `web`. Порты наружу не публикуются, `~/edge/compose.yaml` не трогаем: остальные сайты на сервере не перезапускаются.

| Контейнер | Что делает | Сети |
|---|---|---|
| `prodclub-web` | сайт на Next.js | internal, web |
| `prodclub-api` | Django: админка (`/admin`) и API для сайта. При старте сам делает `migrate` и `collectstatic` | internal, web |
| `prodclub-db` | Postgres 17, данные в томе `prodclub_pgdata` | только internal |
| `prodclub-files` | nginx: фото кейсов (`/media/`) и стили админки (`/static/`) из томов | web |

Магазин, вход и корзина по-прежнему скрыты флагом (`NEXT_PUBLIC_SHOP_ENABLED`).

## Первый запуск бэкенда

Если сайт уже работает (контейнер `prodclub-web`), делай всё по порядку, сайт при этом не падает.

### 1. Код на сервере
Распакуй свежий архив поверх старой папки (файл `deploy/.env` в архиве не лежит, он не затрётся):
```bash
cd ~ && tar xzf prodclub-<версия>.tar.gz && cd prodclub
```
Если папка — клон репозитория, вместо этого `git pull`.

### 2. Настройки
```bash
cp --update=none deploy/.env.example deploy/.env
chmod 600 deploy/.env
nano deploy/.env
```
Заполни:
- `DOMAIN=111cult.ru`
- `DJANGO_SECRET_KEY=` вывод команды `openssl rand -base64 48`
- `POSTGRES_PASSWORD=` вывод `openssl rand -base64 24`

Пароль базы задаётся **один раз**: Postgres запоминает его при первом запуске, менять потом в `.env` бесполезно. Сам `.env` никому не отправляй и в git не клади.

Если `.env` остался от прошлого запуска, в нём только `NEXT_PUBLIC_SHOP_ENABLED`: допиши недостающие строки из `deploy/.env.example`.

### 3. Сборка и запуск
```bash
sudo docker compose -f deploy/docker-compose.yml up -d --build
sudo docker ps --filter name=prodclub     # все четыре; web, api и db должны стать (healthy)
sudo docker logs prodclub-api --tail 30   # Applying ... OK, затем Listening at: http://0.0.0.0:8000
```
Первая сборка бэкенда 2–4 минуты.

### 4. Пользователь для админки
```bash
sudo docker exec -it prodclub-api python manage.py createsuperuser
```
Логин, email (можно пустой) и пароль. Пароль при вводе не отображается, это нормально.

По желанию: 4 кейса из макета как заготовки (без фото), чтобы потом только дописать тексты и загрузить фото:
```bash
sudo docker exec prodclub-api python manage.py seed_cases
```

### 5. Caddy
Замени блок сайта на новый: в нём появились `/admin`, `/media` и `/static`.
```bash
cp ~/edge/sites/prodclub.caddy ~/backups/prodclub.caddy.bak-$(date +%F) 2>/dev/null || true
cp deploy/prodclub.caddy ~/edge/sites/prodclub.caddy
sudo docker exec edge-caddy caddy validate --config /etc/caddy/Caddyfile && sudo docker exec edge-caddy caddy reload --config /etc/caddy/Caddyfile
```
Домен в `deploy/prodclub.caddy` должен совпадать с `DOMAIN` из `.env`. `validate` проверяет конфиг до перезагрузки: если он с ошибкой, `reload` не выполнится и всё продолжит работать по-старому.

### 6. Проверка
- `https://111cult.ru/admin/` открывает вход в админку **со стилями** (без стилей = не работает `/static`, см. «Частые проблемы»);
- после входа есть раздел «Кейсы»;
- добавь кейс с фото: оно должно появиться на `https://111cult.ru/works` и на странице кейса;
- база снаружи не видна: `sudo docker port prodclub-db` ничего не выводит.

## Как добавлять кейсы
`https://111cult.ru/admin/` → «Кейсы» → «Добавить кейс».
- Первое фото = обложка на `/works` и главный экран кейса, остальные идут в галерею.
- Фото автоматически конвертируются в WebP трёх размеров (640, 1280, 2560px), оригинал тоже сохраняется. Грузи фото **крупными**, от 2560px по ширине: из маленького исходника чёткую картинку на широком экране не сделать.
- Если поменяли размеры или качество нарезки (`backend/cases/images.py`), после обновления пересобери фото: `sudo docker exec prodclub-api python manage.py rebuild_case_images`.
- Пустые поля (задача, метрики, цитата) на странице кейса не показываются.
- Снятая галочка «опубликован» прячет кейс с сайта, не удаляя его.

Изменения появляются на сайте сразу, пересборка не нужна.

## Обновление
1. Залей и распакуй новый архив (шаг 1).
2. Запусти:
   ```bash
   ~/prodclub/deploy/update.sh
   ```
Скрипт делает бэкап базы в `~/backups/`, запоминает образ сайта для отката, пересобирает фронт и бэкенд и ждёт `healthy`.

## Бэкапы
База сама по себе в бэкап не попадает. Вручную:
```bash
mkdir -p ~/backups
sudo docker exec prodclub-db sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > ~/backups/prodclub-db-$(date +%F).sql.gz
sudo docker run --rm -v prodclub_media:/media -v ~/backups:/out alpine tar czf /out/prodclub-media-$(date +%F).tar.gz -C /media .
```
Первая команда сохраняет базу (тексты кейсов), вторая — фото.

Восстановление базы из бэкапа (перезапишет текущие данные):
```bash
gunzip -c ~/backups/prodclub-db-<дата>.sql.gz | sudo docker exec -i prodclub-db sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"'
```

## Откат сайта
```bash
~/prodclub/deploy/rollback.sh
```
Возвращает предыдущую сборку фронта (`prodclub-web:prev`). Бэкенд так не откатывается: миграции базы необратимы. Если обновление бэкенда сломало данные, восстанавливай базу из бэкапа, который `update.sh` сделал перед обновлением.

## Что нельзя
- **`docker compose down -v`**: удалит тома с базой и фото. Просто остановить: `sudo docker compose -f deploy/docker-compose.yml stop`.
- Добавлять `ports:` в compose: Docker обходит ufw для опубликованных портов.
- Включать `SECURE_SSL_REDIRECT` в Django: сайт ходит в API по внутреннему http, редирект сломает загрузку кейсов. На https переводит Caddy.
- Класть `deploy/.env`, пароли и IP сервера в репозиторий.

## Частые проблемы
| Симптом | Причина |
|---|---|
| `compose` пишет `впиши ... в deploy/.env` | не заполнен `DJANGO_SECRET_KEY` или `POSTGRES_PASSWORD` |
| `prodclub-api` перезапускается по кругу | `sudo docker logs prodclub-api`: чаще всего не тот пароль базы (пароль менялся после первого запуска) |
| 502 на `/admin` | `prodclub-api` не запущен или не `healthy` |
| Админка без стилей | не применён новый `prodclub.caddy` (нет `/static`) или не запущен `prodclub-files` |
| CSRF verification failed при входе в админку | `DOMAIN` в `.env` не совпадает с адресом в браузере |
| На `/works` нет новых кейсов, только 4 старых без фото | сайт не достучался до API: `sudo docker logs prodclub-api`, затем `sudo docker restart prodclub-web` |
| Фото не грузятся (битые картинки) | не применён новый `prodclub.caddy` (нет `/media`) |
| Страницы грузятся кусками | в блоке Caddy нет `flush_interval -1` |
| Сборка падает на `pnpm install` | не влиты `frontend/pnpm-workspace.yaml` и `frontend/pnpm-lock.yaml` |
