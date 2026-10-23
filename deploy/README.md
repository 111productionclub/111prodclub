# Деплой лендинга на сервер студии

Только фронт (`frontend/`), магазин, вход и корзина скрыты флагом, бэкенд не нужен. Сайт работает как один контейнер `prodclub-web` за общим Caddy (`edge-caddy`), подключается к внешней сети `web`. Порты наружу не публикуются.

Образ собирается внутри Docker (`frontend/Dockerfile`), Node.js на хосте не нужен. Всё проверено локально: compose поднимается, контейнер становится `healthy`, виден по имени `prodclub-web:3000` из сети `web`.

## Что нужно перед началом
- Выбран **домен** лендинга, и его A-записи (`@` и `www`) смотрят на сервер:
  ```bash
  dig +short <домен> @<ns-сервер-регистратора>
  ```
  Домен добавляется в Caddy **только после** этой проверки, иначе Let's Encrypt забанит выпуск.
- Сеть `web` существует: `sudo docker network ls | grep web`.

## 1. Клон репозитория
```bash
cd ~
git clone https://github.com/111productionclub/111prodclub.git prodclub
cd prodclub
```
Выкладываем из ветки `main` (после слияния PR). До слияния можно проверить ветку: `git switch feat/works-page`.

## 2. Настройки
```bash
cp deploy/.env.example deploy/.env
chmod 600 deploy/.env
```
Для запуска лендинга в `deploy/.env` **ничего вписывать не нужно**: пустая `NEXT_PUBLIC_SHOP_ENABLED` оставляет магазин скрытым.

## 3. Сборка и запуск
```bash
sudo docker compose -f deploy/docker-compose.yml up -d --build web
sudo docker ps --filter name=prodclub-web      # статус должен стать (healthy), первая сборка 2-5 минут
sudo docker logs prodclub-web                  # должно быть: ✓ Ready
```

## 4. Caddy
В `deploy/prodclub.caddy` замени `ДОМЕН.RU` на реальный домен, затем:
```bash
cp deploy/prodclub.caddy ~/edge/sites/prodclub.caddy
sudo docker exec edge-caddy caddy validate --config /etc/caddy/Caddyfile && sudo docker exec edge-caddy caddy reload --config /etc/caddy/Caddyfile
```
`validate` должен пройти без ошибок, только тогда `reload`. Остальные сайты при этом не останавливаются.

## 5. Проверка
- `https://<домен>` открывается, сертификат выдан, `/works` работает, фильтры тоже.
- В шапке только «Как мы работаем» и «Работы».
- `/merch` и `/login` дают 404 (так и должно быть).
- Контейнер без опубликованных портов: `sudo docker port prodclub-web` ничего не выводит.

## Обновление сайта
```bash
~/prodclub/deploy/update.sh
```
Скрипт сохраняет текущий образ как `prodclub-web:prev`, делает `git pull --ff-only`, пересобирает контейнер и ждёт `healthy`. Если не стал healthy, выведет подсказку про логи и откат.

## Откат
```bash
~/prodclub/deploy/rollback.sh
```
Возвращает образ `prodclub-web:prev` (предыдущую рабочую сборку). Код в git при этом не откатывается: до исправления причины не делай `git pull`.

Откат вручную, если скрипта нет: `git log --oneline`, `git switch --detach <коммит>`, затем шаг 3.

## Когда будет готов магазин
1. Развернуть бэкенд (`backend/`, Django + Postgres) в этом же проекте во внутренней сети, **без публикации портов**, и добавить отдельный адрес в Caddy.
2. В `deploy/.env` поставить `NEXT_PUBLIC_SHOP_ENABLED=1`, пересобрать (`deploy/update.sh`): значение вшивается в сборку, перезапуска недостаточно.
3. Фронту нужен адрес бэкенда (`API_URL`, имя контейнера бэкенда во внутренней сети) и боевой домен в `CORS_ALLOWED_ORIGINS` Django.

## Что нельзя
- `sudo docker compose down -v` на чужих проектах: удалит их тома. Для этого проекта томов нет, но привычка опасна.
- Добавлять `ports:` в compose: Docker обходит ufw для опубликованных портов.
- Класть секреты и реальные IP/логины сервера в репозиторий.

## Частые проблемы
| Симптом | Причина |
|---|---|
| 502 от Caddy | `prodclub-web` не запущен или не в сети `web`: `sudo docker ps`, `sudo docker network inspect web` |
| Контейнер не становится healthy | `sudo docker logs prodclub-web` |
| Сборка падает на `pnpm install` | не влиты `frontend/pnpm-workspace.yaml` и `frontend/pnpm-lock.yaml` |
| Страница не обновилась после `git pull` | пересобрали без `--build`, используй `deploy/update.sh` |
| В шапке снова мерч | образ собран с `NEXT_PUBLIC_SHOP_ENABLED=1` в `deploy/.env` |
| Страницы грузятся кусками | в блоке Caddy: `reverse_proxy prodclub-web:3000 { flush_interval -1 }` |
