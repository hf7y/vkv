# Archive

Superseded project snapshots, kept for reference and full reversibility. Nothing
here is deleted data — it's just moved out of the top-level listing so the live
projects are easier to find.

## `wavebucks-ancient/`

The original flat-file layout of `wavebucks/` (Code.gs, html/, assets/) from
its first prototype. `wavebucks/` has since been rebuilt into a modular
structure (`wavebucksCore/`, `scribaSenatus/`, `aedile/`). Most files here are
already duplicated in this repo's own git history (see commit `1939a93` and
earlier), but the GIMP `.xcf` source files under `assets/` are excluded from
git everywhere by `.gitignore` (`*.xcf`), so this is their only remaining copy
— that's why the whole folder was archived wholesale rather than deleted.

## `bundles/`

Full-history git bundles for two projects that live in their own GitHub repos
and were cluttering the top level as extra clones:

- `scriba-senatus.bundle` — the original single-file prototype of the
  "Scriba Senatus" ceremonial Senate bot. Its ideas were carried forward and
  rewritten as the modular `wavebucks/scribaSenatus/` app (compare
  `CommandParsers.js`, `Commissiones.js`, etc.). Origin:
  `git@github.com:hf7y/scriba-senatus.git`.
- `wavebucks-old.bundle` — the git history that `wavebucks/wavebucksCore/`
  and `wavebucks/scribaSenatus/` were copied from during the current
  restructuring of `wavebucks/`. Diffing confirms `wavebucksCore/` is byte
  identical and `scribaSenatus/` only has minor updates in the live version.
  Origin: `git@github.com:media-arts-collective/wavebucks.git`.

To restore either as a full working clone with history intact:

```bash
git clone _archive/bundles/scriba-senatus.bundle restored-scriba-senatus
git clone _archive/bundles/wavebucks-old.bundle restored-wavebucks-old
```

Both repos are also up to date on their GitHub origins, so `git clone` from
GitHub works too.
