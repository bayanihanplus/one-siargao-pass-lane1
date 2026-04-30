# OSP Command Center Middleware Syntax Recovery

## Problem

The command center foundation patch damaged `frontend/middleware.ts`, causing frontend build failure with `Return statement is not allowed here`.

## Fix

Rewrote middleware cleanly while preserving:

- public OSP website routes
- protected traveler/operator/admin/LGU route boundaries
- narrow local-development bypass for `/admin/partners`
- narrow local-development bypass for `/lgu/intelligence`
- narrow local-development bypass for `/admin/intelligence`

## Hard Boundary

The bypass is exact-route and local-development only. It must not be expanded to all `/admin` or all `/lgu` routes.

## Protected Routes

- `/traveler/home` unchanged
- `/siargao-passport-map` unchanged
- no commit
