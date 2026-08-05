#!/bin/bash
set -e

echo "Patching backend main.py..."

MAIN="backend/app/main.py"

# Add import if missing
if ! grep -q "from app.services.health import service_health" "$MAIN"; then
    sed -i '1i from app.services.health import service_health' "$MAIN"
fi

# Add route if missing
if ! grep -q "/api/health/services" "$MAIN"; then
cat >> "$MAIN" <<'PYEOF'


@app.get("/api/health/services")
def health_services():
    return service_health()
PYEOF
fi


echo "Patching frontend api.js..."

API="frontend/src/services/api.js"

if ! grep -q "getServiceHealth" "$API"; then
cat >> "$API" <<'JSEOF'


export async function getServiceHealth() {
    const res = await fetch("/api/health/services");
    return await res.json();
}
JSEOF
fi


echo "Health patch complete."

