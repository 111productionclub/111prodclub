#!/usr/bin/env bash
# Откат на предыдущую сборку (образ prodclub-web:prev, сохранённый update.sh).
# Код в git не откатывается: после отката не делай git pull, пока не исправишь причину.
set -euo pipefail

cd "$(dirname "$0")/.."

if ! sudo docker image inspect prodclub-web:prev >/dev/null 2>&1; then
    echo "Нет сохранённого образа prodclub-web:prev, откатываться некуда." >&2
    exit 1
fi

sudo docker tag prodclub-web:prev prodclub-web:latest
sudo docker compose -f deploy/docker-compose.yml up -d --no-build --force-recreate web
echo "Откат выполнен. Проверка: sudo docker ps --filter name=prodclub-web"
