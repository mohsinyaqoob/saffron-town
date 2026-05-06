#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if [[ ! -x .venv-gsc/bin/python ]]; then
  python3 -m venv .venv-gsc
  .venv-gsc/bin/pip install -q google-api-python-client google-auth-oauthlib google-auth-httplib2
fi
exec .venv-gsc/bin/python scripts/gsc_sites.py "$@"
