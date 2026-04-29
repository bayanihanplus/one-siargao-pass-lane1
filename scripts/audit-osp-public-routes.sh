#!/usr/bin/env bash
set -euo pipefail

echo "================================================================"
echo "OSP PUBLIC ROUTE REGRESSION AUDIT"
echo "================================================================"

ROOT_URL="${ROOT_URL:-http://localhost:3000}"

curl -s "$ROOT_URL/" > /tmp/osp-audit-root.html
curl -s "$ROOT_URL/siargao-passport-map" > /tmp/osp-audit-spm.html
curl -s "$ROOT_URL/traveler/start" > /tmp/osp-audit-start.html
curl -s "$ROOT_URL/login?mode=returning" > /tmp/osp-audit-login.html

python3 - <<'PY'
from pathlib import Path
import re
import sys
from html import unescape

pages = {
    "/": unescape(Path("/tmp/osp-audit-root.html").read_text(errors="ignore")),
    "/siargao-passport-map": unescape(Path("/tmp/osp-audit-spm.html").read_text(errors="ignore")),
    "/traveler/start": unescape(Path("/tmp/osp-audit-start.html").read_text(errors="ignore")),
    "/login?mode=returning": unescape(Path("/tmp/osp-audit-login.html").read_text(errors="ignore")),
}

failed = False

for route, html in pages.items():
    hrefs = sorted(set(re.findall(r'href="([^"]+)"', html)))
    print(f"\n=== {route} HREFS ===")
    for h in hrefs:
        print(h)

    forbidden = [
        "/traveler/passport-map",
        "/traveler/trips",
        "/traveler/trips/new",
        "/traveler/pass",
        "/traveler/settings",
        "/traveler/payments",
        "/traveler/profile",
        "/traveler/checkpoints",
    ]

    for h in hrefs:
        if any(h.startswith(f) for f in forbidden):
            print(f"FAIL {route}: forbidden public href exposed: {h}")
            failed = True

    for marker in ["Cannot find module", "Server Error", "Role-aware landing flow", "Open Dev Route Index"]:
        if marker in html:
            print(f"FAIL {route}: forbidden marker found: {marker}")
            failed = True

root = pages["/"]
root_hrefs = sorted(set(re.findall(r'href="([^"]+)"', root)))

checks = [
    ("Create My OSP Pass" in root, "Root has Create My OSP Pass"),
    ("Open Passport Map" in root, "Root has Open Passport Map"),
    ("Continue My Trip" not in root, "Root removed fake Continue My Trip"),
    ("/traveler/start" in root_hrefs, "Root links start to /traveler/start"),
    ("/siargao-passport-map" in root_hrefs, "Root links map to /siargao-passport-map"),
    ("/login?mode=returning" in root_hrefs, "Root uses login returning for protected actions"),
    ("Trip Active" not in root, "Root does not show Trip Active"),
    ("Pass Ready" not in root, "Root does not show Pass Ready"),
    ("Traveler One" not in root, "Root does not show Traveler One"),
    ("OSP-ACTIVE" not in root, "Root does not show OSP-ACTIVE"),
]

print("\n=== ROOT ASSERTIONS ===")
for ok, label in checks:
    print(("PASS: " if ok else "FAIL: ") + label)
    if not ok:
        failed = True

spm = pages["/siargao-passport-map"]
spm_hrefs = sorted(set(re.findall(r'href="([^"]+)"', spm)))

spm_checks = [
    ("Siargao Passport Map" in spm, "SPM landing has Siargao Passport Map"),
    ("Follow the Trails. Build the Journey." in spm, "SPM landing has locked tagline"),
    ("/traveler/start" in spm_hrefs, "SPM landing links to /traveler/start"),
    ("/login?mode=returning" in spm_hrefs, "SPM landing links saved progress to login"),
]

print("\n=== SPM ASSERTIONS ===")
for ok, label in spm_checks:
    print(("PASS: " if ok else "FAIL: ") + label)
    if not ok:
        failed = True

if failed:
    print("\nFAIL: OSP public route regression audit failed.")
    sys.exit(1)

print("\nPASS: OSP public route regression audit passed.")
PY
