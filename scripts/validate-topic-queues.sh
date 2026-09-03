#!/usr/bin/env bash
# Fail fast if topic queue JSON cannot parse. Invalid queues abort SEO Daily
# before any agents dispatch (see awards-show duplicate rationale, Sep 2026).
set -euo pipefail

python3 - <<'PY'
import json
import pathlib
import sys

root = pathlib.Path("content-library/topics")
failed = False
for path in sorted(root.glob("*.json")):
    try:
        json.loads(path.read_text())
        print(f"ok {path}")
    except json.JSONDecodeError as e:
        print(f"::error file={path},line={e.lineno},col={e.colno}::{e.msg}", file=sys.stderr)
        failed = True
if failed:
    sys.exit(1)
PY
