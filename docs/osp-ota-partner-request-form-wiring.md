# OSP OTA Partner Request Form Wiring

## Purpose

This lane converts the `/ota` public website page from static customer-facing content into a real partner request intake surface.

## What Changed

- Created `frontend/src/components/public/OtaPartnerRequestForm.tsx`
- Wired `/ota#partner-request` to submit to backend partner application endpoint.
- Uses `POST /api/v1/partners/apply` via `NEXT_PUBLIC_API_BASE_URL`, defaulting locally to `http://localhost:8001/api/v1`.
- Keeps partner access review-based.
- Keeps token issuance blocked.
- Keeps API activation non-automatic.

## Boundaries

- Did not expose token UI.
- Did not expose admin partner UI.
- Did not allow OTA to issue QR independently.
- Did not modify `/traveler/home`.
- Did not modify `/siargao-passport-map`.
- Did not commit.

## Browser QA Required

Check:

- http://localhost:3000/ota

Submit a test partner request while backend is running on port 8001.

Expected:

- Form submits successfully.
- Success message shows application ID.
- PartnerAccount row is created.
- PartnerApiAuditLog row is created.
- No token is created.
