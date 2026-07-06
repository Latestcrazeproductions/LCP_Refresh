#!/usr/bin/env bash
# Split Supabase env vars: production stays on Production; dev project on Preview + Development.
# Requires: vercel login && vercel link (from repo root)
#
# Usage: ./scripts/setup-vercel-dev-env.sh

set -euo pipefail

PROD_URL="https://qsccsddknmvidvcfpffu.supabase.co"
DEV_URL="https://aafiingdoulyghucrzat.supabase.co"
DEV_ANON="sb_publishable_danPW6_6Ry-iSmlJjNNrCA_OzFP3EzO"
PROD_ANON="sb_publishable_ApCzT3HvnB5AEvKYilq3BA_D1K8QHwq"

# Preview requires a third arg: "" = all Preview branches (non-interactive).
add_preview() {
  local name=$1 value=$2
  vercel env add "$name" preview "" --value "$value" -y --non-interactive
}

add_env() {
  local name=$1 env=$2 value=$3
  vercel env add "$name" "$env" --value "$value" -y --non-interactive
}

echo "Setting Preview + Development → LCP Development Supabase..."
add_preview NEXT_PUBLIC_SUPABASE_URL "$DEV_URL"
add_preview NEXT_PUBLIC_SUPABASE_ANON_KEY "$DEV_ANON"
add_env NEXT_PUBLIC_SUPABASE_URL development "$DEV_URL"
add_env NEXT_PUBLIC_SUPABASE_ANON_KEY development "$DEV_ANON"

echo ""
echo "Ensuring Production → production Supabase (URL + anon)..."
add_env NEXT_PUBLIC_SUPABASE_URL production "$PROD_URL"
add_env NEXT_PUBLIC_SUPABASE_ANON_KEY production "$PROD_ANON"

echo ""
echo "SUPABASE_SERVICE_ROLE_KEY (add manually — secrets not stored in this repo):"
echo ""
echo "  # Production — prod service_role from qsccsddknmvidvcfpffu dashboard"
echo "  vercel env add SUPABASE_SERVICE_ROLE_KEY production --value YOUR_PROD_SERVICE_ROLE -y --non-interactive --sensitive"
echo ""
echo "  # Preview — dev service_role from aafiingdoulyghucrzat dashboard"
echo "  vercel env add SUPABASE_SERVICE_ROLE_KEY preview \"\" --value YOUR_DEV_SERVICE_ROLE -y --non-interactive --sensitive"
echo ""
echo "  Local dev: put dev service_role in .env.development.local (Vercel Development target rejects --sensitive)."
echo ""
echo "Current Supabase vars:"
vercel env ls 2>&1 | rg -i supabase || vercel env ls 2>&1 | grep -i supabase || true
