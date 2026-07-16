# Smart Cities Build

A legacy grab-bag of assets and prototype code from an earlier "Smart
Cities"-themed build/hackathon effort (files date to Jan–Sep 2023). This
folder isn't a single coherent project — it's several loosely related
threads that got dropped in the same place. Nothing here is under active
development; treat it as an archive pending future cleanup/reconciliation.

## What's in here

- **`Drachmas/`** — ancient-Greek/Roman-currency-themed art: scans of real
  historic Greek drachma banknotes (`Gri-*-Drachmen-*.jpg`), AI-generated
  ("DALL·E") and hand-cleaned drachma bill mockups
  (`Clean1000Drachma.png`, `VKV1000Drachma.png`), and a decorative
  `FriezeBorder.svg`. Thematically this is the same "ancient-currency"
  concept seen elsewhere in this monorepo (the Roman-themed `wavebucks`
  project) — likely an earlier design pass at a krewe/community currency
  concept, this time Greek rather than Roman. Left untouched — these are
  unique creative assets, not duplicates.

- **`bylaws.html`** — bylaws for the "Virtual Krewe of Vaporwave" (the
  `VKV` this parent repo is named for), referencing governance tokens and
  "Wavebucks." Confirms this folder, `Drachmas/`, and the `wavebucks/`
  project are all part of the same broader VKV community-currency effort.
  Left untouched as a genuine reference document.

- **Barcode/label templates** — `Bulk Barcode Creator and Print.pdf`
  (kept only inside `pi-files/`, see Deduplication below), `barcodes.odt`,
  and the Avery 5160 label templates (`Template for _Avery 5160_ (by
  labelsmerge.com).docx/.pdf`). Left untouched — genuine reference
  templates, not disposable duplicates.

- **Loose shell scripts** — `port-to-script.sh`, `script-on-port.sh`,
  `stdin-to-port.sh`. Small utilities for piping stdin/audio to a network
  port and back. **Not** identical to the same-named scripts inside
  `pi-files/` (see below) — kept as-is, differences documented.

- **`pi-files/`** — its own nested git repository (remote
  `git@github.com:hf7y/vkv23.git`), effectively a Raspberry Pi's home
  directory: `wpa_supplicant.conf` (wifi config), `.profile` (shell
  login config), a `sounds/` folder of ~30 numbered animal sound samples
  (`bird00.wav` … `duck29.wav`), the same three shell scripts (later
  revisions — see below), a `tuba-parts.ly` (LilyPond music notation
  stub), and the canonical copy of the barcode PDF. **Do not modify** —
  treat as a self-contained repo with its own history.

  This looks like an early prototype for a physical kiosk: a Raspberry Pi
  that plays animal sounds over a network-triggered port and prints
  barcodes/labels. That's conceptually the same territory the sibling
  `vibe-kiosk/` project (a Pi-based kiosk doing barcode printing and
  OMR/bubble-sheet form scanning) now covers as a proper, actively
  developed pipeline. Worth reconciling/retiring `pi-files/` in favor of
  `vibe-kiosk/` at some point, but that's a call for the project owner —
  left untouched here.

## Deduplication performed

Confirmed byte-identical duplicates were removed from the top level of
`Smart Cities Build/` in favor of the canonical copies already versioned
inside `pi-files/`:

- **`Bulk Barcode Creator and Print.pdf`** — identical to
  `pi-files/Bulk Barcode Creator and Print.pdf` (verified via `diff` and
  matching md5 `f141dfc205fc00cc163152afb944c6ec`). Top-level copy removed.

- **11 loose animal-sound `.wav` files** — `bird.wav`, `bird0.wav`,
  `bird2.wav`, `cat0.wav`, `cat2.wav`, `chicken0.wav`, `chicken2.wav`,
  `cow0.wav`, `cow2.wav`, `duck0.wav`, `duck2.wav` — each verified
  byte-identical (via `cmp`) to one of the numbered variants in
  `pi-files/sounds/` (e.g. `bird0.wav`/`bird.wav` == `sounds/bird00.wav`;
  `cat2.wav` == `sounds/cat11.wav`; full sounds library has ~6 numbered
  variants per animal, e.g. `bird00/05/10/15/20/25.wav`). These were an
  older, smaller excerpt of the same sample library that already lives,
  in full, inside `pi-files/sounds/`. Top-level copies removed.

## Left alone (not identical — do not assume duplicates)

The three loose shell scripts at the top level (`port-to-script.sh`,
`script-on-port.sh`, `stdin-to-port.sh`) are **not** byte-identical to
their same-named counterparts in `pi-files/`, despite the similar
purpose — the `pi-files/` versions are later, more developed revisions:

- `port-to-script.sh`: pi-files version adds `echo` status lines
  ("Watching $port...", "Done.").
- `script-on-port.sh`: pi-files version reworks the matching logic to
  read from `sounds/*.wav` (its own sample library) instead of the
  current directory, and adds an `if [ -f "$target" ]` guard plus an
  explicit `aplay -Dhw:0,0` device argument.
- `stdin-to-port.sh`: pi-files version changes the target `ip` from a
  hardcoded LAN address (`192.168.0.21`) to `localhost`, and adds an
  `exit` keyword to break the read loop.

Since these differ in real, non-trivial ways, both copies were kept
in place rather than deduplicated.
