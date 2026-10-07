# Navigation hotfix — 3 October 2026

Production logs showed 404 responses for prior-release wallet, scene, dialog, Lenis, and other JavaScript chunks while a visitor was still using an older document. This explains why development-only checks did not cover the reported live failure. Missing code can interrupt client-side navigation and lazy features.

Changes:
- Header, footer, home-logo, and mobile navigation use standard document links. They do not intercept clicks or depend on the client router.
- Mobile navigation uses native details/summary so opening links does not require hydration.
- Footer Whitepaper opens the website's Whitepaper page consistently with the navbar.
- HTML and RSC responses specify private, no-store caching.
- Immutable JavaScript/CSS assets from the two earlier releases remain available. Prebuild captures the previous local release; postbuild merges compatibility assets without replacing current output.
- Full-page navigation clears in-memory drafts/context that was not explicitly saved. The workspace and policy explain this; no private state is newly persisted.

Verification: navbar Privacy and footer Privacy Policy clicks reached their expected pages in Chromium. TypeScript passed. Production build passed with retained assets. Previously missing wallet, scene, dialog and Lenis filenames are present in the deployment assets. Additional navbar/footer destinations checked during final regression.
