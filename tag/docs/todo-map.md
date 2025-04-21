project/
│
├─ src/
│   ├ Code.gs
│   │   ┌── doGet(e)
│   │   │     • IF token present:
│   │   │         → lookupToken(token)
│   │   │             ✓ match → HtmlService.createHtmlOutputFromFile("success")
│   │   │             ✗ no match → HtmlService.createHtmlOutputFromFile("denied")
│   │   │     • ELSE (no token):
│   │   │         → HtmlService.createTemplateFromFile("gateway").evaluate()
│   │   └── include(filename)  ← helper for templating
│   │
│   ├ tokenUtils.gs           ← unchanged
│   ├ sheetConfig.gs          ← ensure SHEET_NAME = "Gateway"
│   ├ emailSender.gs          ← add logEvent() calls on success/failure
│   └ Test.gs                 ← stress/edge‑case tests
│
├─ html/
│   ├ gateway.html
│   │     • Remove any hard‐coded <style> and <script> sections
│   │     • In <head>: 
│   │           <style><?!= include("visual") ?></style>
│   │     • In <body> form:
│   │           <form class="chalkboard" id="email-form" novalidate>…
│   │     • At end of <body>:
│   │           <script><?!= include("accessForm") ?></script>
│   │
│   ├ visual.html
│   │     • Add chalkboard border CSS:
│   │         .chalkboard {
│   │           border: 8px solid transparent;
│   │           border-image: url('../assets/board/chalkboard_border.png') 8 fill stretch;
│   │           background-color: #2f3e33;
│   │         }
│   │     • Add .scene, .bureaucrat, .speech-bubble, .response styles
│   │
│   ├ accessForm.html
│   │     • Strip out <script> tags; leave only raw JS
│   │     • Ensure:
│   │         google.script.run
│   │             .withSuccessHandler(...)
│   │             .withFailureHandler(...)
│   │             .sendAccessEmail(email, GATEWAY_URL);
│   │     • Add logEvent('FormSubmitted', …) before sendAccessEmail
│   │     • Disable/enable submit button in handlers
│   │
│   ├ success.html
│   │     • Add:
│   │         <style><?!= include("visual") ?></style>
│   │     • Insert placeholder “Centurion grants pass” sprite:
│   │         <img src="../assets/sprites/guard_after.png" alt="Access Granted">
│   │
│   └ denied.html
│         • Add:
│         <style><?!= include("visual") ?></style>
│         • Insert “Guard still holds keys” sprite:
│         <img src="../assets/sprites/guard_before.png" alt="Access Denied">
│
├─ assets/
│   ├ sprites/
│   │   • sprite_sheet.png
│   │   • guard_before.png
│   │   • guard_after.png
│   │   • keys_ring.png
│   │   • gateway_closed.png
│   │   • gateway_open.png
│   │   • rollerskate_wheel.png
│   │
│   └ board/
│       • chalkboard_border.png
│
└─ appsscript.json
    • Ensure:
        "webapp": {
          "executeAs": "USER_DEPLOYING",
          "access":   "ANYONE_ANONYMOUS"
        }
