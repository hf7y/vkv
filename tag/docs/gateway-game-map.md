## 📊 Project Structure Flowchart – Tokenized Access Gateway (v2)

```text
                        +-----------------------------+
                        |   Tokenized Access Gateway  |
                        |      (Apps Script Project)  |
                        +-------------+---------------+
                                      |
                    +----------------+----------------+
                    |                                     |
        +-----------v----------+            +------------v-----------+
        |   Code.gs            |            |  appsscript.json       |
        |   Main router        |            |  Manifest config       |
        +-----------+----------+            +------------------------+
                    |
        +-----------v-----------+
        |    doGet(e)           |
        |   - Route by token    |
        |   - Serve HTML views  |
        +-----------+-----------+
                    |
      +-------------+-------------+
      |                           |
+-----v-----+             +-------v------+
| success   |             |   denied     |
| .html     |             |   .html      |
| Token OK  |             | Token fail   |
+-----------+             +--------------+

                     ┌────────────────────────────────────┐
                     │         📊 Spreadsheet: Gateway     │
                     │    [ Email | Site | Token | Time ]  │
                     └────────────────────────────────────┘

+---------------------------------------------------------------+
|                          Supporting Code                      |
+------------------+----------------+----------------+----------+
| tokenUtils.gs    | sheetConfig.gs | emailSender.gs | Test.gs  |
| - Generate token | - Constants    | - Send email   | - Stress |
| - Store token    |   for sheet    | - Build body   |   tests  |
| - Lookup token   |                |                |          |
+------------------+----------------+----------------+----------+

🔸 NEW (v2)
───────────────────────────────────────────────────────────────────
|   +------------------+                                           |
|   |  🔸 gateway.html  | ← Entry portal with email form            |
|   +------------------+                                           |
|   |  🔸 accessForm.js | ← Handles form submission & animation    |
|   +------------------+                                           |
|   |  🔸 visual.css    | ← Optional pixel art gateway styling     |
|   +------------------+                                           |
|   |  doGet updated    → shows gateway.html if no token           |
|   |  + logic to run   sendAccessEmail via google.script.run      |
|                                                               |
|   Result: user enters email → receives token → uses magic link |
|           → sees success.html or denied.html                   |
───────────────────────────────────────────────────────────────────


