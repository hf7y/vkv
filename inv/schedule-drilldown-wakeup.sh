#!/usr/bin/env bash
# Queues a one-shot `at` job ~1 hour from now that wakes Claude Code up to
# redo/verify the drill-down browse-tab redesign (branch:
# drilldown-browse-redesign, inv/inventory-app), as an independent
# double-check of the first pass -- plus the open questions from this same
# session (bug-report-per-tab structure, the 403-on-new-deployment
# display) and continuing further passes on the "browse tab as a spatial
# block-building tool, metadata minimized" direction.
#
# Usage: bash schedule-drilldown-wakeup.sh
# Check it's queued: atq
# See its exact command: at -c <job-number-from-atq>
# Cancel it: atrm <job-number>

set -euo pipefail

PROMPT='You are doing an independent, thorough re-verification AND continuation pass on the drill-down browse-tab redesign, branch drilldown-browse-redesign in /home/zach/Documents/vkv/inv/inventory-app (a Google Apps Script web app). Work through ALL of these in order, committing to the branch as you complete meaningful chunks (do not wait until the very end for one giant commit) and pushing to origin regularly:

1. Orient yourself: git log --oneline -10, git diff main...drilldown-browse-redesign --stat, read html/browse.html, html/style.html, src/Data.gs in full, and README.md'"'"'s relevant sections, to understand exactly what pass 1 built (an isometric root map that drills into a front-on shelf view or a top-down bin/contents view depending on Container Style, with a minimal floating toolbar instead of a form).

2. Build a throwaway local test harness (mock google.script.run with fixture data, load sprites.html+style.html+browse.html as a file:// page, drive it via headless Chromium + synthetic PointerEvents) and re-verify, from scratch, independent of any prior session'"'"'s claimed results: root iso-level drag-to-reposition and footprint-collision blocking; clicking a container with children drills straight in (a leaf selects instead); front-shelf view drag/reorder/collision; top-down grid drag/reposition/collision; breadcrumb navigation across multiple levels and back; the floating edit toolbar (appears on double-click, Rotate/Size only at iso-root level, Icon-cycle persists via updateItem). Specifically check a known suspect bug: the edit-toolbar'"'"'s hidden attribute may be getting overridden by its own display:flex CSS rule, showing an empty pill even when nothing is selected -- confirm whether this was already fixed; if not, fix it. Delete the harness file when done with each check.

3. Stress-test scenarios pass 1 likely did not cover, and fix anything broken: a shelf containing a ROTATED bin (MapD > MapW); deeper nesting (drill three levels, not just two); an empty shelf/empty bin; a top-down grid with 10+ items; a deep link (INITIAL_ID/showObject) into a mid-hierarchy item.

4. Push further on the actual design direction, not just bug-fixing: the browse tab should read as a spatial block-building tool first (a virtual lego game), metadata editing strongly secondary. Evaluate and improve: whether double-click-to-select is discoverable enough or needs a visible hover affordance; whether dragging feels physically satisfying (snapping/feedback) or mechanical; whether a container'"'"'s fullness could be shown visually without a metadata field to edit (prototype if cheap, otherwise note it); whether reusing isometric sprites as flat icons in the shelf/top-down views is holding up visually or needs flagging more prominently as needing real flat art.

5. Two flagged, unresolved questions from the broader session -- analyze and write up options, do NOT decide or implement unilaterally: (a) should bug/feature tracker reports each get their own sheet tab, and what would "separate" mean concretely (per report? per project, since src/Bugs.gs explicitly shares its shape with the unrelated chezz project)? (b) every time this Apps Script project gets a NEW deployment ID, old links 403 -- sketch what a stable redirect layer would need (inv-redirects is mentioned in README.md as a prior attempt) without implementing it.

6. Before finishing: confirm every meaningful change has a real commit on drilldown-browse-redesign, pushed to origin. Write a final summary covering exactly what was re-verified and confirmed solid, what was found broken and fixed (with commit references), what design improvements were made, the two write-ups from step 5, and what is left for a further pass.'

LOG="/home/zach/wake-$(date +%s).log"

echo "cd /home/zach/Documents/vkv/inv/inventory-app && claude -p \"$PROMPT\" --allowedTools \"Bash,Read,Write,Edit,Glob,Grep\" --max-turns 200 >> $LOG 2>&1" | at now + 1 hour

echo "Queued. Check with: atq"
echo "Log will be written to: $LOG"
