#!/usr/bin/env bash
# Fast-forward origin/main to origin/development. Refuses if main has unique commits.
set -euo pipefail

git fetch origin main development

main_sha=$(git rev-parse origin/main)
dev_sha=$(git rev-parse origin/development)
repo="${GITHUB_REPOSITORY:-Latestcrazeproductions/LCP_Refresh}"
compare_url="https://github.com/${repo}/compare/${main_sha}...${dev_sha}"

if [ "$main_sha" = "$dev_sha" ]; then
  echo "main already matches development (${dev_sha:0:7}). Nothing to publish."
  if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
    {
      echo "## Publish to production"
      echo "Nothing to publish — \`main\` and \`development\` are both \`${dev_sha:0:7}\`."
    } >> "$GITHUB_STEP_SUMMARY"
  fi
  exit 0
fi

if ! git merge-base --is-ancestor "$main_sha" "$dev_sha"; then
  echo "::error::main has commits that are not on development. Refusing a non-fast-forward publish."
  echo "Commits on main but not development:"
  git log --oneline origin/development..origin/main
  exit 1
fi

echo "Publishing ${main_sha:0:7} → ${dev_sha:0:7}"
echo "Compare: ${compare_url}"
echo ""
echo "Commits going live:"
git log --oneline "$main_sha..$dev_sha"

git push origin "$dev_sha:refs/heads/main"

range_md=$(git log --oneline "$main_sha..$dev_sha" | sed 's/^/- /')
body=$(cat <<EOF
Published to production (fast-forward \`main\` to \`development\`).

- Previous \`main\`: \`${main_sha:0:7}\`
- Now live: \`${dev_sha:0:7}\`
- Compare: ${compare_url}

Commits:

${range_md}
EOF
)

if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  echo "$body" >> "$GITHUB_STEP_SUMMARY"
fi

if [ -n "${GH_TOKEN:-${GITHUB_TOKEN:-}}" ]; then
  gh api "repos/${repo}/commits/${dev_sha}/comments" -f body="$body" >/dev/null
  echo "Posted commit comment on ${dev_sha:0:7}."
fi
