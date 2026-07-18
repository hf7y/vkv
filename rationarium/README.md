# Rationarium

A single page that answers "what needs a director's attention today?" across
every Res Publica Vaporwave system — the Wavebucks treasury, the inventory
storehouse, the gateway access log, Aedile's open loops, active Senate
motions, and the live-show installations (laser harps, hazer control). Open
`index.html` in a browser. That's the whole install.

This is a **demo built on fictional sample data** — no real krewe member,
balance, or event appears in it. It's meant to show the shape of a real
integration, not to already be one.

## Why this exists

Right now, knowing what needs attention means separately opening the
Wavebucks spreadsheet, the inventory sheet, the gateway's token log, and
Aedile's `OpenLoops` tab — four places, four mental models, and no single
"here's what's on fire" view. Rationarium is a read-only aggregation layer:
it renders whatever data those systems produce, side by side, and nothing
more.

That scope is deliberate, not a limitation. `wavebucks/aedile/CLAUDE.md`
lays out the ecosystem's actual design philosophy for automation here:

> **Engine work** (tracking, scheduling, bookkeeping, logging) is fair game
> for automation. **Ritual work** (taste, conflict resolution, valuation —
> anything requiring judgment about what the krewe *should* value) is
> humans only, always.
>
> Four prior automation attempts have failed — each one relocated the
> hidden human-operator labor rather than eliminating it.

Rationarium is Engine work and nothing else. It doesn't decide who owes
wavebucks, doesn't flag a member, doesn't draft a reply, doesn't rank what
matters most. It surfaces state that already exists elsewhere so a director
doesn't have to go collect it by hand. If it ever grows a feature that
requires taste, that feature belongs in a different tool.

## Running it

```bash
open rationarium/index.html   # or just double-click it
```

No build step, no server, no npm install. The page is a single static HTML
file with inline CSS and JS. All rendering happens client-side against the
object literal `window.RATIONARIUM_DATA`, defined near the top of the
`<script>` block in `index.html`.

## Data model

Each panel expects a small, specific shape. The sample data in `index.html`
follows these shapes exactly; the same-named JSON Schema files under
`schema/` spell them out formally (useful if a real exporter wants to
validate its output before wiring it in).

| Panel | Schema | Real source (not yet wired up) |
|---|---|---|
| Aerarium (Treasury) | `schema/wavebucks.schema.json` | `wavebucks/wavebucksCore/` — the `Balances` and `Transactions`/`Log` sheets |
| Horreum (Storehouse) | `schema/inventory.schema.json` | `inv/inventory-app/src/Data.gs` — `queryObjects()` over the ID/ParentID sheet |
| Porta (The Gate) | `schema/gate.schema.json` | `tag/src/tokenUtils.gs` — the token issue/verify log |
| Aedilis (Open loops) | `schema/openloops.schema.json` | `wavebucks/aedile/OpenLoops.js` — the `OpenLoops` tab, near 1:1 already |
| Senatus (Motions) | `schema/motions.schema.json` | `wavebucks/scribaSenatus/` — `Commissiones.js`/`Causae.js` |
| Machina (Installations) | `schema/machina.schema.json` | `Code Dumpster/CodeDumpster` — the laser-harp firmware + `src/hazer-control` live-show rigs (would need a per-rig heartbeat) |

### Wiring in real data (not done here, but this is the shape of it)

None of the five source projects currently export JSON, and this demo does
not modify any of them — that's out of scope for a documentation/demo pass,
and those projects are actively being worked on elsewhere. The realistic
path, if someone picks this up later:

1. Add one small `doGet(e)` case to each Apps Script project (most already
   have a `doGet` entry point) that reads its own sheet and returns
   `ContentService.createTextOutput(JSON.stringify(...))` shaped per the
   matching schema above. `inv`'s `Data.gs` already has `queryObjects()` —
   that one's close to a direct passthrough.
2. Replace the `window.RATIONARIUM_DATA` literal in `index.html` with a
   `fetch()` against those five endpoints (or a small script that polls
   them on a timer and writes a static `data.json` this page fetches
   instead — simplest if every source is a spreadsheet with irregular
   update frequency, since it avoids five live cross-origin calls from a
   static page).
3. Keep the render code as-is — `renderAerarium()` etc. already consume
   exactly the shapes in `schema/`, so nothing else in `index.html` should
   need to change.

## Design notes

- **Dark, single-theme.** This page commits to one aesthetic — a Roman
  monument lit by a vaporwave night sky — rather than supporting a light
  mode. That's a deliberate choice (the same way a themed arcade cabinet
  doesn't ship a "daylight" skin), not an oversight.
- **Status color is reserved.** The four status colors (good/warning/
  serious/critical) never double as decoration — the gradient wordmark and
  background glow are a separate, fixed accent that never touches a data
  value, so color always means the same thing everywhere on the page.
- **Every chip carries a label, never just a color** — colorblind-safe by
  construction, not by luck.
- **The chart has a table fallback.** The Aerarium daily-flow chart has a
  "View as table" toggle producing the identical data as an actual
  `<table>`, so nothing on the page depends on being able to read a bar
  chart.

## Future work

This is one implementation out of several plausible next steps for this
ecosystem. Others worth considering (not built here):

- **Wire Rationarium up to real data.** The obvious next step for this
  specific project — see "Wiring in real data" above.
- **A shared token/auth micro-library.** `tag` (`tokenUtils.gs`), `wavebucks`
  (`Login.gs`), and `inv` each hand-roll their own email-magic-link token
  flow independently. A single small Apps Script library shared across all
  three would mean fixing an auth bug once instead of three times — the
  `GATEWAY_URL`/`gatewayURL` bug fixed in `tag/` during this same cleanup
  pass is exactly the kind of bug that duplication invites.
- **A public "Acta Diurna."** `wavebucks/scribaSenatus` already produces
  passed motions (Senatus Consulta); nothing currently publishes them
  anywhere a member could browse without spreadsheet access. A static page
  alongside `nomac.org` rendering the passed-motion ledger would give the
  Senate's decisions the public presence the ceremony implies.
- **Reconcile `Smart Cities Build/pi-files` and `vibe-kiosk`.** Both are an
  OMR/fiducial/barcode kiosk pipeline; `pi-files` looks like the earlier
  prototype of what `vibe-kiosk` now does properly. Worth a deliberate
  decision on whether to retire one in favor of the other, rather than
  maintaining two.
- **A single scannable "Civis" card.** `vibe-kiosk` already prints a
  barcode from a scored form. If that same barcode also resolved to a
  Wavebucks account and a `tag` gate token, one physical card (or badge)
  could double as currency ID and gate access — one scan instead of three
  separate systems at a physical event.
