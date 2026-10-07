# Contributing

Open an issue describing a concrete problem before substantial changes. Keep request approval explicit, wallet state separate from AI payloads, and privacy claims aligned with implemented behavior.

Use Node 22.13+ and `npm ci`. Before submitting a pull request run `npm test`, `npm run typecheck`, `npm run check:repository`, and `npm run build`. Include the behavior changed and relevant validation in the pull request. Never commit environment files, credentials, session data, `node_modules`, or generated `dist` output.

Changes to provider integration require real end-to-end verification before the public verification flag is enabled. Do not claim successful transactions or provider privacy guarantees based on fixtures.
