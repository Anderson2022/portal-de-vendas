#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/pool-business-management-erp"
BACKEND_DIR="$PROJECT_ROOT/poolcontrol-backend"
RUNTIME_DIR="$PROJECT_ROOT/.local-run"
DATABASE_CONTAINER="dadosfrontback-postgres17"
BACKEND_JAR="$BACKEND_DIR/target/poolcontrol-backend-0.1.0-SNAPSHOT.jar"

for executable in docker java node npm curl python3; do
    if ! command -v "$executable" >/dev/null 2>&1; then
        echo "Comando necessário não encontrado: $executable" >&2
        exit 1
    fi
done

if [[ ! -f "$BACKEND_JAR" ]]; then
    echo "Backend não compilado. JAR esperado: $BACKEND_JAR" >&2
    exit 1
fi

if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
    echo "Instale as dependências com: cd \"$FRONTEND_DIR\" && npm ci" >&2
    exit 1
fi

mkdir -p "$RUNTIME_DIR"
chmod 700 "$RUNTIME_DIR"

echo "Verificando o banco existente..."
if [[ "$(docker inspect -f '{{.State.Running}}' "$DATABASE_CONTAINER")" != "true" ]]; then
    docker start "$DATABASE_CONTAINER"
fi

DATABASE_READY=false
for ((attempt = 1; attempt <= 30; attempt++)); do
    if docker exec "$DATABASE_CONTAINER" pg_isready -U poolcontrol -d poolcontrol_numerico2 >/dev/null 2>&1; then
        DATABASE_READY=true
        break
    fi
    sleep 1
done
if [[ "$DATABASE_READY" != "true" ]]; then
    echo "O banco não ficou disponível. Verifique: docker logs $DATABASE_CONTAINER" >&2
    exit 1
fi

if ! curl --fail --silent --max-time 3 http://127.0.0.1:8081/actuator/health >/dev/null; then
    echo "Iniciando backend na porta 8081..."
    export DB_URL="jdbc:postgresql://127.0.0.1:5435/poolcontrol_numerico2"
    export DB_USER="poolcontrol"
    if [[ -n "${POOLCONTROL_DB_PASSWORD:-}" ]]; then
        export DB_PASSWORD="$POOLCONTROL_DB_PASSWORD"
    else
        DB_PASSWORD="$(docker inspect "$DATABASE_CONTAINER" --format '{{json .Config.Env}}' |
            python3 -c 'import json,sys; print(next((v.split("=", 1)[1] for v in json.load(sys.stdin) if v.startswith("POSTGRES_PASSWORD=")), ""))')"
        export DB_PASSWORD
    fi
    export PORT="8081"
    export SPRING_FLYWAY_ENABLED="${POOLCONTROL_APLICAR_MIGRATIONS:-false}"
    export BOOTSTRAP_ENABLED="false"

    if [[ "${POOLCONTROL_APLICAR_MIGRATIONS:-false}" == "true" ]]; then
        MIGRATIONS_DIR="$RUNTIME_DIR/startup-migrations"
        mkdir -p "$MIGRATIONS_DIR"
        python3 - "$BACKEND_JAR" "$MIGRATIONS_DIR" <<'PY_MIGRATIONS'
import re
import sys
import zipfile
from pathlib import Path

with zipfile.ZipFile(sys.argv[1]) as archive:
    for name in archive.namelist():
        match = re.fullmatch(r"BOOT-INF/classes/db/migration/(V(\d+)__[^/]+\.sql)", name)
        if match and 73 <= int(match[2]) <= 84:
            Path(sys.argv[2], match[1]).write_bytes(archive.read(name))
PY_MIGRATIONS
        # Validate the explicitly authorized range; older migrations are outside
        # this location and their existing history/checksums are left unchanged.
        export SPRING_FLYWAY_LOCATIONS="filesystem:$MIGRATIONS_DIR"
        export SPRING_FLYWAY_IGNORE_MIGRATION_PATTERNS="*:missing"
    fi

    SECRET_FILE="$FRONTEND_DIR/.local/backend-secret.txt"
    if [[ -f "$SECRET_FILE" ]]; then
        export JWT_SECRET="$(cat -- "$SECRET_FILE")"
    fi

    cd "$BACKEND_DIR"
    nohup java -Xmx512m -jar "$BACKEND_JAR" > "$RUNTIME_DIR/backend.log" 2>&1 < /dev/null &
    STARTED_BACKEND_PID=$!
    echo "$STARTED_BACKEND_PID" > "$RUNTIME_DIR/backend.pid"
    cd "$PROJECT_ROOT"

    BACKEND_READY=false
    for ((attempt = 1; attempt <= 45; attempt++)); do
        if curl --fail --silent --max-time 2 http://127.0.0.1:8081/actuator/health >/dev/null; then
            BACKEND_READY=true
            break
        fi
        sleep 1
    done
    if [[ "$BACKEND_READY" != "true" ]]; then
        echo "Backend não iniciou. Consulte: $RUNTIME_DIR/backend.log" >&2
        exit 1
    fi
fi

if python3 -c 'import socket; socket.create_connection(("127.0.0.1", 3001), timeout=2).close()' 2>/dev/null; then
    echo "Frontend já está atendendo na porta 3001."
    echo "Acesse http://localhost:3001"
    if [[ -n "${STARTED_BACKEND_PID:-}" ]]; then
        echo "Mantenha este terminal aberto para acompanhar o backend."
        wait "$STARTED_BACKEND_PID"
    fi
    exit 0
fi

echo "Backend disponível. Iniciando frontend na porta 3001..."
echo "Acesso neste servidor: http://localhost:3001"
echo "Acesso pela rede local: http://192.168.100.25:3001"
echo "Mantenha este terminal aberto. Ctrl+C encerra o frontend."
cd "$FRONTEND_DIR"
export BACKEND_URL="http://127.0.0.1:8081"
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1536}"
exec npm run dev -- --webpack --port 3001
