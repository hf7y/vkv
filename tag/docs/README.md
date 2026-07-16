# `docs/` Folder

Design notes and ASCII diagrams sketched out while building the Tokenized
Access Gateway (TAG). These are working/planning documents, not authoritative
specs — when in doubt, the code in `src/` and `html/` is the source of truth.

They overlap quite a bit (several were drawn at different points while the
gateway UI was being fleshed out), so here's what distinguishes each:

- **`system-diagram.md`** — the highest-level conceptual view: TAG as a
  "Link Issuer" + "Access Verifier" pair sharing a token spreadsheet. No file
  names, just the concept.
- **`gateway-map.md`** — a project-structure diagram mapping the concept onto
  actual files (`Code.gs`, `tokenUtils.gs`, `emailSender.gs`,
  `sheetConfig.gs`, the HTML views, `Test.gs`).
- **`gateway-roadmap-v2.md`** (formerly `gateway-map (2).md`) — a v2 sketch of
  the same flow, framed around the Roman-bureaucracy gateway scene, plus a
  short "Future Placeholder Elements" wishlist (Centurion sprite, animated
  gate, sound FX) that was never built. Renamed from `gateway-map (2).md`
  because that name made it look like an accidental duplicate/download
  artifact of `gateway-map.md` — it isn't; the content differs (see the
  roadmap list at the bottom), so it was kept rather than deleted.
- **`gateway-game-map.md`** — another v2 structure flowchart, closest to the
  current actual file layout (adds `gateway.html` / `accessForm.html` /
  `visual.html` and notes `doGet` was updated to serve `gateway.html`).
- **`todo-map.md`** — the implementation checklist/spec that was used to
  actually build the current `html/` files. Mostly matches what's live today;
  see the top-level `README.md`'s "Known Issues" section for the places
  where the implementation still falls short of this spec (notably
  `success.html` / `denied.html`).

No action needed here beyond reading — these were left as historical/planning
artifacts rather than consolidated, since merging them isn't a small, safe
change.
