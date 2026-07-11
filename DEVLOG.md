# Devlog

Tracks changes and lessons learned on this project. Newest entries on top.

## 2026-07-11
- Renamed `pdftocsv.html` → `standardbank.html` (it's Standard Bank-specific; name was misleading now that `gotyme.html` exists too). Updated 3 links in `index.html`.

### Lessons
- File names should identify the bank they parse (see `gotyme.html`), not the generic action (`pdftocsv.html`). Generic names stop working once a second bank is added.
