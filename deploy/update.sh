#!/usr/bin/env bash
# Обновление сайта: бэкап базы, пересборка фронта и бэкенда.
# Запускать на сервере из любого места: ~/prodclub/deploy/update.sh
# Код обновляется заранее: распакованным архивом или git pull (если папка — клон репозитория).
set -euo pipefail

cd "$(dirname "$0")/.."
COMPOSE="sudo docker compose -f deploy/docker-compose.yml"

# Бэкап базы перед обновлением: миграции при старте бэкенда необратимы
if [ "$(sudo docker inspect -f '{{.State.Running}}' prodclub-db 2>/dev/null)" = "true" ]; then
    mkdir -p ~/backups
    dump=~/backups/prodclub-db-$(date +%F-%H%M).sql.gz
    sudo docker exec prodclub-db sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > "$dump"
    echo "Бэкап базы: $dump"
fi

# Запоминаем рабочий образ сайта, чтобы можно было откатиться (deploy/rollback.sh)
if sudo docker image inspect prodclub-web:latest >/dev/null 2>&1; then
    sudo docker tag prodclub-web:latest prodclub-web:prev
fi

if [ -d .git ]; then
    git pull --ff-only
fi
$COMPOSE up -d --build

echo "Жду, пока контейнеры станут healthy..."
for _ in $(seq 1 60); do
    web=$(sudo docker inspect -f '{{.State.Health.Status}}' prodclub-web 2>/dev/null || echo "none")
    api=$(sudo docker inspect -f '{{.State.Health.Status}}' prodclub-api 2>/dev/null || echo "none")
    if [ "$web" = "healthy" ] && [ "$api" = "healthy" ]; then
        echo "Готово: prodclub-web и prodclub-api healthy"
        exit 0
    fi
    sleep 2
done

echo "ОШИБКА: web=$web api=$api. Логи: sudo docker logs prodclub-web / prodclub-api. Откат сайта: deploy/rollback.sh" >&2
exit 1
