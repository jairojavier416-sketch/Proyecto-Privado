#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# setup_labels.sh
# Crea todos los labels de TaskBot en tu repositorio de GitHub
#
# USO:
#   bash setup_labels.sh TU_USUARIO TU_REPO TU_TOKEN
#
# CÓMO OBTENER EL TOKEN:
#   GitHub → Settings → Developer settings → Personal access tokens
#   → Tokens (classic) → Generate new token → marcar "repo"
# ═══════════════════════════════════════════════════════════════

USUARIO=$1
REPO=$2
TOKEN=$3

if [ -z "$USUARIO" ] || [ -z "$REPO" ] || [ -z "$TOKEN" ]; then
  echo "❌ Uso: bash setup_labels.sh TU_USUARIO TU_REPO TU_TOKEN"
  exit 1
fi

API="https://api.github.com/repos/$USUARIO/$REPO/labels"
AUTH="Authorization: token $TOKEN"

crear_label() {
  local nombre="$1"
  local color="$2"
  local desc="$3"
  echo "Creando label: $nombre"
  curl -s -X POST "$API" \
    -H "$AUTH" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$nombre\",\"color\":\"$color\",\"description\":\"$desc\"}" > /dev/null
}

echo ""
echo "🚀 Creando labels de PRIORIDAD..."
crear_label "prioridad: alta"  "FF4757" "🔴 Urgente, hay que hacerlo ya"
crear_label "prioridad: media" "FFA502" "🟡 Importante pero no urgente"
crear_label "prioridad: baja"  "2ED573" "🟢 Se puede hacer cuando haya tiempo"

echo ""
echo "👥 Creando labels de GRUPOS..."
crear_label "grupo: alpha" "FF6B6B" "🔺 Grupo Alpha"
crear_label "grupo: beta"  "4ECDC4" "🔷 Grupo Beta"
crear_label "grupo: gamma" "A29BFE" "🟣 Grupo Gamma"
crear_label "grupo: delta" "FDCB6E" "🔶 Grupo Delta"
crear_label "grupo: omega" "55EFC4" "🟢 Grupo Omega"

echo ""
echo "✅ Creando labels de ESTADO..."
crear_label "estado: pendiente"   "E8E8F0" "⏳ Sin empezar o en progreso"
crear_label "estado: en progreso" "74B9FF" "🔄 Alguien está trabajando en esto"

echo ""
echo "✅ ¡Todos los labels creados en $USUARIO/$REPO!"
echo "👉 Ve a: https://github.com/$USUARIO/$REPO/labels para verlos"
