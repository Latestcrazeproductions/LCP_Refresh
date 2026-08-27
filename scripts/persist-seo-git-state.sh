#!/usr/bin/env bash
# Commit orchestrator state and push to development, rebasing if agent PRs
# merged while this job was running.
set -euo pipefail

msg="${1:?commit message required}"
shift
if [ "$#" -eq 0 ]; then
  echo "::error::No files specified to persist."
  exit 1
fi

git config user.name "lcp-seo-bot"
git config user.email "seo-bot@latestcrazeproductions.com"
git add -- "$@"
if git diff --cached --quiet; then
  echo "No scheduler state changes."
  exit 0
fi
git commit -m "$msg"

max=5
for i in $(seq 1 "$max"); do
  git fetch --unshallow origin development 2>/dev/null || git fetch origin development
  if git rebase origin/development && git push origin HEAD:development; then
    echo "Pushed scheduler state to development."
    exit 0
  fi
  echo "Persist push rejected (attempt ${i}/${max}); rebasing again."
  git rebase --abort 2>/dev/null || true
  sleep $((i * 2))
done

echo "::error::Could not push scheduler state after ${max} rebases. development moved while this job ran."
exit 1
