# Plant Card

A flexible multi-plant Lovelace card with:
- device auto-evaluate & entity fill
- thresholds with single/double chevrons under units
- optional per-plant thumbnail (click to open lightbox)
- DE/EN i18n, editor with sensible defaults

**Images**: store under `/config/www/plant-pictures/...`, reference via `/local/plant-pictures/...`.

## Installation
- **HACS**: Add this repository as a custom repository (Frontend). Install the latest release.
- **Manual**: Copy `dist/plant-card.js` to `/config/www/community/plant-card/` (or `/config/www/`), then add a dashboard resource:
