# vkv

Projects for the **Virtual Krewe of Vaporwave** (VKV), a Mardi Gras krewe run
by the nonprofit [Media Arts Collective](https://nomac.org). Most of these
tools share a running joke that became a real convention: krewe operations
are modeled as a Roman republic — a Senate that passes motions, a treasury,
gates, storehouses — rendered in Google Apps Script and vaporwave neon.

This file is the map. Each project has its own README with real detail;
this one just says what everything is and how the pieces relate.

## Active projects

| Folder | What it is | Status |
|---|---|---|
| `wavebucks/` | The krewe's internal currency ledger, plus the Apps Script bots built around it (`scribaSenatus`, `aedile`) | **Being actively restructured right now — see note below** |
| `inv/` | Inventory/gear tracking web app (isometric map + QR scan-to-print) | **Being actively worked on right now — see note below** |
| `tag/` | Email magic-link gateway: request access, get a token link, in or out | Documented & bug-fixed this pass |
| `vibe-kiosk/` | Physical pipeline: scan a paper form → OMR → 4D vector → barcode label | Documented & cleaned up this pass |
| `nomac.org/` | Media Arts Collective's public site (GitHub Pages) | Documented & bug-fixed this pass |
| `Smart Cities Build/` | Legacy 2023 grab-bag: Drachma currency art, barcode/label templates, an older OMR/kiosk prototype (`pi-files/`) | Documented & deduplicated this pass |
| `Code Dumpster/` | Tyler's hardware/installation repo — the krewe's **live-show rigs**: laser harps (`VKV_LS_*` Teensy firmware), `hazer-control` (DMX hazer controller, vaporwave neon UI), plus infra (Packer/Hyper-V) | Submodule; laser-harp/hazer branch merged to `main` this pass |
| `rationarium/` | **New**: a demo operator dashboard unifying status across the above (now incl. a `Machina` panel for the live-show rigs) | Built this pass — see below |
| `_archive/` | Superseded snapshots of `wavebucks`/`scriba-senatus`, kept for reversibility | Consolidated this pass |
| `tag/`, `wavebucks/aedile/`, etc. | Individual project docs | See each folder's own `README.md`/`CLAUDE.md` |

**A note on `inv/` and `wavebucks/`:** both had uncommitted, in-progress
changes already sitting in the working tree before this cleanup pass
started (files deleted/restructured, new subfolders like `wavebucks/aedile/`
and `wavebucks/wavebucksCore/` not yet committed). That's other work in
flight — this pass deliberately left both folders untouched, including
their pre-existing uncommitted state, to avoid colliding with it.

## How the pieces fit together

- **`wavebucks/wavebucksCore`** is the ledger: balances, credits, debits.
- **`wavebucks/scribaSenatus`** is the ceremonial governance bot — email
  commands (`ROGO`, `SECONDO`, `DISCESSIO`, `FAVEO`/`ANTIQVO`/`ABSTINEO`)
  that move a motion through proposal → second → vote → outcome.
- **`wavebucks/aedile`** is the newer, narrower ops bot: inbox triage and
  "open loop" bookkeeping for the two directors, built specifically to
  avoid the failure mode of four prior automation attempts (see
  `wavebucks/aedile/CLAUDE.md` — its Engine-work-only design philosophy is
  worth reading before adding automation anywhere in this repo).
- **`tag`** is a separate, smaller magic-link gateway used to gate access
  to things (its own token flow, independent of `wavebucks/Login.gs` and
  `inv`'s own auth — all three currently reimplement the same idea
  separately; see Future Work).
- **`inv`** tracks physical gear in a nested container graph (ID/ParentID),
  with a camera-based QR scan-to-print flow.
- **`vibe-kiosk`** is a from-scratch physical pipeline (scanner → OMR →
  barcode printer) that appears to be the spiritual successor of the older
  prototype sitting in `Smart Cities Build/pi-files/` — likely worth
  reconciling into one project eventually.
- **`nomac.org`** is the public face of the whole thing — the org's actual
  website.
- **`Code Dumpster`** is Tyler's side of the same krewe: the *physical*
  live-show installations the software ecosystem exists to support — the
  `VKV_LS_*` laser-harp firmware and the `hazer-control` DMX rig (vaporwave
  "neon sunset" UI, live-show panic button). It's the hardware counterpart
  to Zach's software half; the two aren't duplicates, they're complementary
  halves of the same event. `rationarium`'s `Machina` panel is where their
  status shows up alongside the rest.
- **`rationarium`** (new) sits on top of all of it: a read-only dashboard
  that would surface whatever each of these systems is already tracking,
  in one place, so a director isn't checking five separate tools to find
  out what needs attention. Currently runs on sample data — see its own
  README for the integration path.

## This cleanup pass (2026-07-16)

- **Archived** `scriba-senatus/`, `wavebucks-old/`, and `wavebucks-ancient/`
  into `_archive/` — all three were confirmed-superseded working copies
  (verified via diff and by checking their own git history), fully
  reversible: `wavebucks-old` and `scriba-senatus` are separate repos
  already pushed to their own GitHub origins and additionally bundled with
  full history under `_archive/bundles/`; `wavebucks-ancient`'s unique
  `.xcf` design source files (excluded from git everywhere by
  `.gitignore`) are preserved wholesale. See `_archive/README.md`.
- **`tag/`**: fixed an undeclared-variable bug (`GATEWAY_URL` vs the real
  `gatewayURL`) that would throw on every gateway page load with no token;
  overhauled docs to match the actual code; flagged (but didn't guess at)
  a duplicated-function ambiguity between `Code.gs` and its own helper
  modules.
- **`vibe-kiosk/`**: stopped tracking a committed `.venv/` and compiler
  artifacts, relocated sample scan images into the folder the README
  already said they belonged in, expanded setup docs with prerequisites
  the README was missing.
- **`nomac.org/`**: fixed a real bug — a past merge had left literal
  unresolved `<<<<<<<`/`=======`/`>>>>>>>` conflict markers committed
  straight into the live, deployed `index.html` and `style.css`. Resolved
  properly (checked what the conflicting branch intended) rather than
  blindly deleting one side. Added a README — it had none.
- **`Smart Cities Build/`**: removed 12 files confirmed byte-identical to
  copies already living in `pi-files/`'s own git history; left every
  genuinely unique asset (Drachma art, barcode templates, bylaws.html)
  untouched. Added a README documenting what this folder actually is.
- **Built `rationarium/`** — see below.
- Left `inv/` and `wavebucks/` completely alone, per the above.

One more thing noticed but *not* touched, since it's inside `inv/` (out of
scope for this pass): `inv/scanscript/` has a local TLS key + cert
(`192.168.0.27-key.pem` / `.pem`) sitting in the working tree. Neither is
git-tracked (checked via `git ls-files`), so there's no history/remote
exposure — but worth a look next time you're in there, in case it's meant
to be gitignored explicitly or rotated.

## Future work (a few ideas, one built)

- **Wire `rationarium/` up to live data.** It's a static demo today —
  each source project would need one small JSON-exporting endpoint. See
  `rationarium/README.md`.
- **A shared token/auth library.** `tag`, `wavebucks`, and `inv` each
  hand-roll their own email-magic-link flow. One bug (the `GATEWAY_URL`
  one fixed this pass) currently has to be found and fixed independently
  in up to three places.
- **A public "Acta Diurna."** `scribaSenatus` produces passed motions
  (Senatus Consulta) that nobody outside spreadsheet access can currently
  read. A page next to `nomac.org` publishing them would give the
  Senate's ceremony an actual public record.
- **Reconcile `Smart Cities Build/pi-files` with `vibe-kiosk`.** Same
  lineage (OMR/fiducial/barcode kiosk), two places. Worth a deliberate
  call on whether to retire one.
- **A single scannable "Civis" card.** If `vibe-kiosk`'s printed barcode
  also resolved to a Wavebucks account and a `tag` gate token, one scan
  at a physical event could stand in for three separate systems.

**Implemented as a demo this pass:** `rationarium/` — a unified operator
dashboard. Open `rationarium/index.html` in a browser, no setup required.
It deliberately does no automation of judgment calls, only aggregation —
see its README for why that line matters here specifically.
