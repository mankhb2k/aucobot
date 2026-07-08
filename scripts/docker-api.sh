#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

IMAGE_REPO="mankhb2k/aucobot-api"
VERSION="$(tr -d '[:space:]' < docker/api.version)"
TEST_ENV_FILE="docker/api.test.env"
TEST_CONTAINER="aucobot-api-test"
API_PORT="${API_PORT:-8387}"

if [[ -z "$VERSION" ]]; then
  echo "error: docker/api.version is empty" >&2
  exit 1
fi

if [[ ! -f "$TEST_ENV_FILE" ]]; then
  echo "error: $TEST_ENV_FILE not found — copy docker/api.test.env.example" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$TEST_ENV_FILE"
set +a

if [[ -z "${GOOGLE_CLIENT_ID:-}" ]]; then
  echo "error: GOOGLE_CLIENT_ID missing in $TEST_ENV_FILE (required for NODE_ENV=production boot)" >&2
  exit 1
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "error: DATABASE_URL missing in $TEST_ENV_FILE" >&2
  exit 1
fi

# migrate runs on host — use localhost instead of host.docker.internal
MIGRATE_DATABASE_URL="${DATABASE_URL/host.docker.internal/localhost}"

echo "==> Ensuring postgres + redis are up"
docker compose up -d postgres redis

echo "==> Running prisma migrate deploy"
DATABASE_URL="$MIGRATE_DATABASE_URL" pnpm --filter @aucobot/database exec prisma migrate deploy

echo "==> Building $IMAGE_REPO:$VERSION and :latest"
docker build \
  --build-arg IMAGE_VERSION="$VERSION" \
  -t "$IMAGE_REPO:$VERSION" \
  -t "$IMAGE_REPO:latest" \
  .

echo "==> Removing previous test container (if any)"
docker rm -f "$TEST_CONTAINER" >/dev/null 2>&1 || true

echo "==> Starting smoke test container"
docker run -d \
  --name "$TEST_CONTAINER" \
  --env-file "$TEST_ENV_FILE" \
  -p "${API_PORT}:${API_PORT}" \
  "$IMAGE_REPO:$VERSION"

cleanup() {
  docker rm -f "$TEST_CONTAINER" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "==> Waiting for /api/health"
for _ in $(seq 1 30); do
  if curl -fsS "http://localhost:${API_PORT}/api/health" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

HEALTH_JSON="$(curl -fsS "http://localhost:${API_PORT}/api/health")"
echo "$HEALTH_JSON"

if ! echo "$HEALTH_JSON" | grep -q '"status":"ok"'; then
  echo "error: health check failed" >&2
  docker logs "$TEST_CONTAINER" >&2 || true
  exit 1
fi

if ! echo "$HEALTH_JSON" | grep -q '"database":"connected"'; then
  echo "error: database not connected" >&2
  docker logs "$TEST_CONTAINER" >&2 || true
  exit 1
fi

echo "==> Smoke test passed"

echo "==> Pushing $IMAGE_REPO:$VERSION"
docker push "$IMAGE_REPO:$VERSION"

echo "==> Pushing $IMAGE_REPO:latest"
docker push "$IMAGE_REPO:latest"

echo "==> Done: $IMAGE_REPO:$VERSION and :latest"
