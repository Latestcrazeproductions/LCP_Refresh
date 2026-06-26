#!/usr/bin/env bash
# Set Vercel Preview/Development env vars to the LCP Development Supabase project.
# Requires: vercel login && vercel link (from repo root)
#
# Usage: ./scripts/setup-vercel-dev-env.sh

set -euo pipefail

DEV_URL="https://aafiingdoulyghucrzat.supabase.co"
DEV_ANON="sb_publishable_danPW6_6Ry-iSmlJjNNrCA_OzFP3EzO"

echo "Setting Preview env vars for Supabase (development project)..."
echo "$DEV_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL preview --force
echo "$DEV_ANON" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview --force

echo ""
echo "Add SUPABASE_SERVICE_ROLE_KEY manually (secret):"
echo "  vercel env add SUPABASE_SERVICE_ROLE_KEY preview"
echo "  (paste service_role key from Supabase → LCP Development → Settings → API)"
echo ""
echo "Production env vars are unchanged — verify they still point at qsccsddknmvidvcfpffu."
