## Tokenized Access Gateway (TAG) – System Diagram

```
                          +--------------------------+
                          |  Tokenized Access        |
                          |  Gateway (TAG)           |
                          +-----------+--------------+
                                      |
         +----------------------------+-----------------------------+
         |                                                          |
 +-------v--------+                                       +---------v---------+
 |  Link Issuer   |                                       |  Access Verifier  |
 | (Apps Script)  |                                       |  (Web App doGet)  |
 +-------+--------+                                       +---------+---------+
         |                                                          |
         |                                                          |
 +-------v------------------+                           +-----------v-------------+
 | Generate unique token    |                           | User visits link with   |
 | and store in sheet with  |                           | ?token=XYZ              |
 | Email + Target Site      |                           |                         |
 +------------+-------------+                           +-----------+-------------+
              |                                                     |
              v                                                     v
     +--------------------+                               +-----------------------+
     | Send Email to User |                               |  Check token against  |
     | with Magic Link    |                               |  shared token sheet   |
     +----------+---------+                               +-----------+-----------+
                |                                                     |
                v                                                     v
     +-----------------------------+                        +----------------------+
     |  User receives email with   |                        |  If token matches:   |
     |  link: https://site.com?    |                        |  grant access to site|
     |         token=XYZ           |                        +----------------------+
     +-----------------------------+

                          Shared Component:
                    +--------------------------------+
                    | Google Sheet: Token Registry   |
                    | Email | Token | Site | Timestamp|
                    +--------------------------------+
```
