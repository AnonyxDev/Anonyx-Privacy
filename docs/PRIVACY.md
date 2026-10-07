# Privacy and data flow

1. Write a prompt and choose context locally.
2. Apply optional pattern masking; review remaining identifiers yourself.
3. Select previous conversation turns explicitly.
4. Inspect the exact request and destination.
5. Approve the current snapshot before external execution.

Tests verify that excluded context and history are absent and that approval does not survive an effective request change. The wallet connector is not an input to automatic request construction.

## Storage and recipients

| Data | Boundary |
| --- | --- |
| Drafts and active transcript | Browser tab memory |
| Saved context | Optional, unencrypted local browser storage |
| Approved request | External provider, only with an enabled verified integration |
| Wallet account and RPC reads | Wallet extension and configured RPC provider |
| Page requests | Hosting infrastructure; IP and request metadata may be visible |

The application adds no product analytics or prompt logging. This does not imply that hosting, RPC, wallet or model providers retain no metadata. A provider can read text sent to it; its retention and training policies must be assessed independently. Local masking is pattern matching and can miss sensitive information.

Clearing a session removes local active state and prevents late responses from repopulating it. It cannot erase a provider's logs or recall an already delivered request. Context-library deletion is separate from session clearing.

No confidential computing, cryptographic anonymity guarantee, independently audited backend or token settlement is implemented. Review the live [privacy page](https://anonyx.lat/privacy) and [privacy policy](https://anonyx.lat/privacy-policy).


## Server gateway update · 7 October 2026

The chat now uses a same-origin server gateway, not the legacy external popup adapter. Approved text passes through Anonyx’s server before reaching the configured provider. Keys stay on the server; platform-authenticated accounts must be allowlisted. No prompt database or application prompt logging is added. See [AI connection setup](ai-connection.md) for activation and remaining verification.
