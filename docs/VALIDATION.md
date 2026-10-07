# Validation

Checked on 7 October 2026. Website source matches published release 26, commit `7dbe843de27b4710870e72c19c4adf401e93a050`. Repository-specific documentation and workflows are updated in this package.

| Check | Result |
| --- | --- |
| Core behavior | 8 tests passed |
| Privacy review | 4 tests passed |
| Wallet behavior | 5 tests passed |
| Motion integrity | 2 tests passed |
| Showcase outputs | 1 test covering all 10 scenarios passed |
| Total behavior tests | 20 passed; no failures or skipped tests |
| TypeScript | Passed with no type errors |
| Production build | Passed from the exported source using its portable profile |
| Repository integrity | Passed: 9 documents, 19 local links, 8 workflows, 16 whitepaper entries |
| Workflow YAML | All 8 files parsed successfully |

Checks used the existing installed dependencies matching the checked-in lockfile. A new dependency installation and hosted GitHub Actions runs were not performed in this update. Actual Actions results must be checked after publication; no green badges are fabricated.

The framework emits route-classification and bundle warnings. No live-provider execution, installed-wallet browser verification, funded transaction, token deployment verification, or confidential-computing attestation is claimed. The contract address is the address supplied for the website.

Lint is not included in these eight workflow checks. Earlier lint findings remain separate cleanup work; lint was not rerun for this source package. Browser interaction and responsive screenshots were not verified during this update.

The GitHub package omits generated deployment caches, dependencies, local tool state, build output, and secret environment files. It retains the asset-retention directory and scripts so clean builds work without old cached releases.
