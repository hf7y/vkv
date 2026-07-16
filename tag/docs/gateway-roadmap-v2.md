## 🗺️ Tokenized Access Gateway v2 – Roman Bureaucracy Scene

```text
                         +----------------------------------+
                         |     Tokenized Access Gateway     |
                         |      (Apps Script Web App)       |
                         +----------------+-----------------+
                                          |
                      +-------------------+-------------------+
                      |                                       |
          +-----------v-----------+             +-------------v-------------+
          |    doGet(e)           |             |      sendAccessEmail()    |
          | - Route by ?token     |             | - Generate token          |
          | - Serve view based on |             | - Store in sheet          |
          |   presence/validity   |             | - Send email              |
          +-----------+-----------+             +-------------+-------------+
                      |                                       |
          +-----------+-----------+                           |
          |   No token in URL     |                           |
          v                       v                           v
+----------------------+   +--------------------+   +-------------------------+
|  🔸 gateway.html      |   |  success.html      |   | Google Sheet: "Gateway" |
|  - Pixel bureau desk |   |  ✅ Token OK        |   |  [Email, Site, Token...]|
|  - Chalkboard form   |   +--------------------+   +-------------------------+
|  - Bureaucrat sprite |                                 ▲
|  - Dialogue bubble   |                                 |
+----------+-----------+                                 |
           |                                              |
           | includes                                    Lookup
           v                                              |
  +---------------------+                      +----------+----------+
  | 🔸 visual.html       |                      |  🔸 tokenUtils.gs   |
  | - CSS for pixel art  |                      |  - generateToken() |
  | - Gate, chalkboard   |                      |  - storeToken()    |
  +---------------------+                      |  - lookupToken()   |
                                               |  - 🔸 logEvent()    |
  +----------------------+
  | 🔸 accessForm.html     |
  | - JS to submit email  |
  | - "I'll have the      |
  |    scribe run it..."  |
  | - Logs attempts       |
  +----------------------+

➕ Future Placeholder Elements:
────────────────────────────────────────────────────
- Centurion sprite (grants access with scroll)
- Animated gate open/close (success/denied)
- Writing name on chalkboard = user input field
- Audio / ambient FX: quill scratch, murmuring
────────────────────────────────────────────────────
