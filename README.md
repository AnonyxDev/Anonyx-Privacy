[![Anonyx — Private access to artificial intelligence](docs/assets/anonyx-banner.svg)](https://anonyx.lat)

# Anonyx

[![core](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/core.yml/badge.svg?branch=main)](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/core.yml)
[![privacy](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/privacy.yml/badge.svg?branch=main)](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/privacy.yml)
[![wallet](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/wallet.yml/badge.svg?branch=main)](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/wallet.yml)
[![motion](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/motion.yml/badge.svg?branch=main)](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/motion.yml)
[![showcase](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/showcase.yml/badge.svg?branch=main)](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/showcase.yml)
[![types](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/types.yml/badge.svg?branch=main)](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/types.yml)
[![repository](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/repository.yml/badge.svg?branch=main)](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/repository.yml)
[![build](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/AnonyxDev/Anonyx-Privacy/actions/workflows/build.yml)

**Give AI the right context. Keep the rest of your world to yourself.**

Anonyx is a privacy-aware AI workspace with local prompt preparation, selective context sharing, explicit request approval, and wallet connectivity. Its product concept is based on OpenAnonymity. The current release is an interactive showcase with prepared example outputs; live inference is not enabled.

[Website](https://anonyx.lat) · [Workspace](https://anonyx.lat/workspace) · [Whitepaper](https://anonyx.lat/whitepaper) · [Privacy](https://anonyx.lat/privacy) · [Walkthrough](https://anonyx.lat/walkthrough) · [X](https://x.com/Anonyx_AI) · [Getting started](docs/GETTING_STARTED.md) · [Architecture](docs/ARCHITECTURE.md)

## What you can explore

| Utility | Implemented behavior |
| --- | --- |
| Workspace | Prepare prompts, select context and conversation turns, and inspect the outgoing payload |
| Request review | Approve a snapshot; changes invalidate the previous approval |
| Context library | Create, organize, import, and export context; optional browser persistence |
| Private session | Clear active session state and invalidate late responses |
| Wallet connection | Choose or switch browser wallets, inspect accounts and network balances |
| Developer tools | Validate and export request JSON; inspect integration boundaries |
| AI agents | Six instruction profiles for general questions, research, writing, coding, analysis, and planning |
| Request examples | Ten editable practical tasks with matching prepared, copyable outputs |
| Guided walkthrough | Choose a task, write a prompt, select context, approve the exact request, and explore its example result |
| Whitepaper | Read whitepaper v2.1: abstract plus 15 chapters directly on the website |
| Token details | Copy the published contract address; inspect the planned Pons V2 economic framework |
| Landing experience | Interactive 3D disclosure chamber, section motion, and reduced-motion support |

## Contract and community

Contract address supplied for the website:

```text
0x1eff1248358914ae08a94b159bed9d5bcc5d2ce7
```

[X: @Anonyx_AI](https://x.com/Anonyx_AI). Publishing this address is not a claim that this repository contains its contract source, verifies its deployment, or implements token payments.

## How the showcase works

Choose an example, use its suggested context or select the first two items yourself, inspect the exact request, approve it, then press Run. The final action explains that live execution is under construction and offers the matching prepared result. Edited prompts, different agent instructions, extra history, or changed context do not receive a fabricated new answer. Your draft is preserved.

`lib/guided-results.ts` contains the ten prepared outputs. `matchesWorkedRequest` requires the exact profile, provider, roles, and message text. Example results are shown separately from live assistant transcripts.

## Privacy by explicit choice

Prompt preparation and context selection happen in the browser. Requests include only selected context and selected conversation turns; wallet identity is not automatically appended. Each request requires approval of the current payload snapshot.

Optional saved context uses **unencrypted local browser storage**. An external model provider receives any approved text sent to it and applies its own policies. Hosting and wallet/RPC services can observe connection metadata. The interface does not establish confidential computing, provider zero retention, or anonymity against those services. Read [PRIVACY.md](docs/PRIVACY.md) for the data flow and limits.

## Run locally

Requires Node.js 22.13 or newer and npm. The workflows use Node 22.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open the development URL printed by the server (normally `http://localhost:5173`). All `NEXT_PUBLIC_*` values are visible to browser users and must contain no secrets.

```sh
npm test
npm run typecheck
npm run check:repository
npm run build
```

## Continuous integration

Eight independent GitHub Actions workflows run on pushes, pull requests, and manual dispatch. Each uses the checked-in lockfile, read-only repository permissions, and a bounded execution time.

| Workflow | What it verifies |
| --- | --- |
| [Core behavior](.github/workflows/core.yml) | Masking, payload selection, context imports and exports |
| [Privacy review](.github/workflows/privacy.yml) | Approval, snapshot isolation, and excluded context |
| [Wallet behavior](.github/workflows/wallet.yml) | Provider detection, switching, declined requests, and disconnection |
| [Motion integrity](.github/workflows/motion.yml) | Disclosure boundaries, finite particle positions, and timing |
| [Showcase outputs](.github/workflows/showcase.yml) | Exact example matching and exclusion of unrelated contact records |
| [Type safety](.github/workflows/types.yml) | Strict TypeScript compilation |
| [Production build](.github/workflows/build.yml) | Clean production compilation and generated deployment artifacts |
| [Repository integrity](.github/workflows/repository.yml) | Documentation links, workflow structure, whitepaper coverage, and required assets |

Live status badges should be added only after this source is published to its final GitHub owner/repository and Actions has run. Local results are recorded in [VALIDATION.md](docs/VALIDATION.md).

## Architecture and integrations

React 19 and TypeScript provide the interface. Vinext/Vite compile the application for a Cloudflare-compatible Worker. GSAP and React Three Fiber provide motion and 3D scenes. Wagmi and viem manage wallet connections and RPC reads.

Live inference is gated behind a separately hosted HTTPS adapter and `NEXT_PUBLIC_INFERENCE_VERIFIED=true`. The included Puter adapter is integration source, not evidence of a verified production service. Keep the flag disabled until authentication, provider pinning, payload isolation, cancellation, and charging behavior have been verified end to end. See [GETTING_STARTED.md](docs/GETTING_STARTED.md).

No token smart-contract implementation, payment execution, confidential-computing backend, or production inference service is implemented in this repository. Unavailable execution is disclosed at the point of use; no successful transaction is fabricated.

## Repository map

| Path | Purpose |
| --- | --- |
| `app/` | Marketing, workspace, documentation, and policy routes |
| `components/anonyx/` | Product interface, wallet dialog, and motion |
| `lib/` | Payload preparation, approval logic, wallet selection, and whitepaper |
| `integrations/puter-adapter/` | Separately hosted inference adapter source |
| `tests/` | Deterministic behavior tests |
| `scripts/` | Build, installation, and integrity checks |
| `public/` | Fonts, wallet icons, and 3D assets |
| `compatibility-assets/` | Release-asset retention directory; deployment caches are omitted from this source package |
| `docs/` | Setup, architecture, privacy, and verification notes |
| `.github/workflows/` | Eight automatic checks |

## Contributions and rights

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). No project-wide open-source license has been selected; publication does not grant an MIT or other license. Dependencies and bundled third-party assets retain their respective licenses; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
