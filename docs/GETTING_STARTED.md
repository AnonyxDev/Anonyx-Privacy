# Getting started

Use Node 22.13+ and npm. Install with `npm ci`, copy `.env.example` to `.env.local`, and run `npm run dev`. Clean clones use the portable framework profile automatically. Keep `.sites-runtime` and environment files out of Git.

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Optional WalletConnect project identifier; without it, the QR connector is omitted |
| `NEXT_PUBLIC_INFERENCE_ADAPTER_ORIGIN` | Separately hosted HTTPS inference adapter origin |
| `NEXT_PUBLIC_INFERENCE_VERIFIED` | Defaults to false; enable only after integration verification |

Browser wallets can connect independently of inference. WalletConnect is optional. Robinhood Chain Testnet (46630) is the default; mainnet (4663) is also configured. RPC reads depend on network availability.

The adapter source is under `integrations/puter-adapter/`. Host it independently, allow only the exact parent origin, and verify authentication, pinned models/providers, quota errors, usage charging, cancellation and cross-origin messaging before enabling inference. Provider credentials must never enter public environment variables.

## Commands

`npm test` runs all five test files. `npm run typecheck` verifies TypeScript. `npm run check:repository` verifies documentation and repository structure. `npm run build` generates `dist/`. `npm run start` serves the generated Worker locally using Wrangler.

Routes: `/`, `/workspace`, `/privacy`, `/privacy-policy`, `/developers`, `/tokenomics`, `/whitepaper`, `/walkthrough`.

The checked-in hosting manifest describes the existing Anonyx Site. A fork does not acquire deployment ownership. GitHub workflows compile and test; they do not deploy. Release asset retention preserves immutable assets needed by previously opened browser sessions.

See [Architecture](ARCHITECTURE.md) and [Privacy](PRIVACY.md).

## Publish to GitHub

After authenticating GitHub CLI in your own environment, initialize this clean source directory and publish it as `Anonyx-Privacy`:

```sh
git init -b main
git add .
git commit -m "Publish Anonyx source, documentation and CI workflows"
gh repo create Anonyx-Privacy --public --source=. --remote=github --push
```

Check the resulting repository's Actions tab. All eight workflows trigger on the first push. GitHub account or organization policies may require enabling Actions. The build workflow performs compilation only; no hosting credentials are required. Add workflow badges using the actual repository URL after runs complete.

## Update an existing repository

Copy this package into the existing Anonyx checkout, preserving its `.git` directory and any unrelated repository files. Review the diff, run the validation commands, and commit the update. Do not run `gh repo create` for an existing repository. The package includes website source from release 26 and updated repository documentation and workflows.


## Current chat connection

The current chat uses the server-side gateway. Follow [AI connection setup](ai-connection.md); the separate-origin adapter instructions above are historical reference and do not enable the current workspace.
