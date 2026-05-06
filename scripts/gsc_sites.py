#!/usr/bin/env python3
"""OAuth to Google Search Console (read-only), cache token, then list sites."""

from __future__ import annotations

import os
import sys
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
ROOT = Path(__file__).resolve().parent.parent
SECRET = ROOT / "gsc_secret.json"
TOKEN_PATH = ROOT / ".gsc-oauth-token.json"


def main() -> None:
    if "--reauth" in sys.argv:
        TOKEN_PATH.unlink(missing_ok=True)

    if not SECRET.is_file():
        print(f"Missing OAuth client JSON: {SECRET}", file=sys.stderr)
        sys.exit(1)

    creds: Credentials | None = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(SECRET), SCOPES)
            creds = flow.run_local_server(port=0, open_browser=True)
        TOKEN_PATH.write_text(creds.to_json(), encoding="utf-8")

    service = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
    resp = service.sites().list().execute()
    entries = resp.get("siteEntry") or []
    if not entries:
        print("(No sites returned — account may have no GSC properties.)")
        return
    for row in sorted(entries, key=lambda e: e.get("siteUrl") or ""):
        url = row.get("siteUrl")
        perm = row.get("permissionLevel")
        print(f"{url}\t{perm}")


if __name__ == "__main__":
    main()
