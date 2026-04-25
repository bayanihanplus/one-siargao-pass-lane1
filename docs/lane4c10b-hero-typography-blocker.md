# Lane 4-C.10-B — Hero Typography Blocker

## Decision

Hero Typography is blocked until approved font assets or approved text assets are available.

## Reason

The approved SPM hero typography cannot be reproduced faithfully using generic browser/system font fallbacks.

Rejected fallback behavior:
- “Hello, Explorer!” becomes too generic, heavy, playful, or inconsistent.
- “Mapped” does not match the approved elegant handwritten script.
- Yellow underline cannot be accurately recreated with generic CSS/SVG approximation.
- Browser/system font rendering varies by device.
- “Almost similar” output is rejected.

## Hard Rule

Do not attempt another Hero Typography CSS fallback patch.

Do not commit any Hero Typography patch unless browser output is visually aligned to the approved UI.

## Required Assets — Font Strategy

Preferred:
1. SPM approved script/handwritten font
2. SPM approved serif/display font if Georgia is not acceptable
3. spm-hero-mapped-underline.svg

## Required Assets — Text Asset Strategy

Fallback:
1. frontend/public/osp/spm-hero-greeting.svg or .png
2. frontend/public/osp/spm-hero-mapped.svg or .png
3. frontend/public/osp/spm-hero-mapped-underline.svg or .png
4. Optional: frontend/public/osp/spm-hero-title.svg or .png

## Forbidden

- Comic Sans
- Bradley Hand
- Apple Chancery
- Segoe Script
- generic cursive fallback
- generic underline approximation
- full-page screenshot import
- non-dynamic full-page mockup
- backend/DB/Prisma changes in this lane

## Next Valid Action

Continue only after approved font files or approved hero text assets are saved into the project.
