                         +---------------------------------------+
                         |  Tokenized Access Gateway (TAG)      |
                         |  Google Apps Script Web App Project  |
                         +-----------------+---------------------+
                                           |
               +---------------------------+---------------------------+
               |                                                           |
       +-------v-------+                                           +-------v-------+
       |  appsscript.json  |                                       |     Code.gs      |
       |  - Manifest       |                                       |  - doGet(e)      |
       |  - OAuth scopes   |                                       |  - include()     |
       +-------------------+                                       +--------+--------+
                                                                               |
                                                                               v
                                                                  +------------+------------+
                                                                  |   Routing Logic         |
                                                                  | - no token → gateway    |
                                                                  | - valid token → success |
                                                                  | - invalid token → denied|
                                                                  +------------+------------+
                                                                               |
                                                                               v
                                    +------------------------------------------+------------------------------------------+
                                    |                                                                                     |
                          +---------v---------+                                                                 +---------v---------+
                          |   gateway.html    |                                                                 |    success.html    |
                          |  (Roman office +   |                                                                 |   (“Access OK”)    |
                          |   form scene)      |                                                                 +--------------------+
                          +---------+---------+
                                    |
                                    v
                          +---------+---------+
                          | accessForm.html   |
                          | - Handle form     |
                          |   submit          |
                          | - Call sendAccessEmail()     |
                          | - logEvent(“FormSubmitted”)  |
                          +---------+---------+
                                    |
                                    v
                          +---------+---------+
                          | emailSender.gs    |
                          | - generateToken() |
                          | - storeToken()    |
                          | - sendEmail()     |
                          | - logEvent()      |
                          +---------+---------+
                                    |
                                    v
                          +---------+---------+
                          | tokenUtils.gs     |
                          | - generateToken() |
                          | - storeToken()    |
                          | - lookupToken()   |
                          +---------+---------+
                                    |
                                    v
                          +---------+---------+
                          | sheetConfig.gs    |
                          | - SHEET_ID        |
                          | - SHEET_NAME      |
                          | - column indices  |
                          +---------+---------+
                                    |
                                    v
                          +---------+---------+
                          | Spreadsheet “Gateway” |
                          | - Tokens tab         |
                          |   [Email, Site, Token, Timestamp]|
                          | - Logs tab           |
                          +---------+---------+
                                    |
                                    v
                          +---------+---------+
                          |   denied.html     |
                          |  (“Access Denied”) |
                          +---------+---------+
                                    |
                                    v
                          +---------+---------+
                          |     Test.gs       |
                          | - Stress tests    |
                          | - Lookup tests    |
                          +-------------------+
