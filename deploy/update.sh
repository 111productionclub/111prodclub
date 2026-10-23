#!/usr/bin/env bash
# Обновление сайта: забирает изменения из git и пересобирает контейнер.
# Запускать на сервере из любого места: ~/prodclub/deploy/update.sh
set -euo pipefail

cd "$(dirname "$0")/.."
COMPOSE="sudo docker compose -f deploy/docker-compose.yml"

# Запоминаем рабочий образ, чтобы можно было откатиться (deploy/rollback.sh)
if sudo docker image inspect prodclub-web:latest >/dev/null 2>&1; then
    sudo docker tag prodclub-web:latest prodclub-web:prev
fi

git pull --ff-only
$COMPOSE up -d --build web

echo "Жду, пока контейнер станет healthy..."
for _ in $(seq 1 30); do
    status=$(sudo docker inspect -f '{{.State.Health.Status}}' prodclub-web 2>/dev/null || echo "none")
    if [ "$status" = "healthy" ]; then
        echo "Готово: prodclub-web healthy ($(git rev-parse --short HEAD))"
        exit 0
    fi
    sleep 2
done

echo "ОШИБКА: контейнер не стал healthy. Логи: sudo docker logs prodclub-web. Откат: deploy/rollback.sh" >&2
exit 1
