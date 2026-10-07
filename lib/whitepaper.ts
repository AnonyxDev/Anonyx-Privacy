export type WhitepaperBlock = {type:'paragraph'|'heading';text:string}|{type:'list';items:string[]}|{type:'table';caption:string;columns:string[];rows:string[][]};
export type WhitepaperChapter = {id:string;number:string;title:string;blocks:WhitepaperBlock[]};
export const whitepaperRevision = {version:'2.1',date:'7 October 2026',chapterCount:15};
// Revised from the supplied Anonyx whitepaper. Current boundaries checked against this source release.
// Previous edition: https://docs.google.com/document/d/1bqtbJ-Lxp1nY6GW98NlWMun1zX2J3D4fu5gfdlfHv6Y
export const whitepaperChapters: WhitepaperChapter[] = [
  {
    "id": "abstract",
    "number": "",
    "title": "Abstract",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Anonyx is a privacy-oriented AI access platform designed to give people and applications greater control over the information they share with artificial intelligence systems. Its architecture separates identity, personal context, inference, and payment so these functions do not automatically form a single user profile."
      },
      {
        "type": "paragraph",
        "text": "The core product is a workspace for preparing a request, selecting useful context, inspecting the exact payload, and approving what is shared. Model access and multi-model workflows extend this request lifecycle. The chat interface is an entry point; controlled information disclosure is the underlying utility."
      },
      {
        "type": "paragraph",
        "text": "This edition describes the current browser controls and the intended infrastructure separately. Local preparation and approval reduce unnecessary disclosure, but do not make submitted text unreadable to a model provider or establish anonymous access. Confidential computing and privacy-preserving usage authorization require additional implementation and independent verification."
      },
      {
        "type": "paragraph",
        "text": "Anonyx is designed for blockchain-based components on Robinhood Chain. The purpose of that layer is programmable authorization and transparent resource accounting; prompts, context, and conversation content should remain off chain."
      }
    ]
  },
  {
    "id": "chapter-1",
    "number": "1",
    "title": "Purpose and Product Scope",
    "blocks": [
      {
        "type": "paragraph",
        "text": "AI requests can contain client information, project details, credentials, preferences, and personal history. Account-based services may also link these requests with identity, payment, and network metadata. Anonyx addresses unnecessary information sharing within the parts of the request lifecycle it controls."
      },
      {
        "type": "paragraph",
        "text": "A useful request needs enough information to complete a task. It does not need every stored preference, every previous conversation, or a connected wallet address. Anonyx lets the user decide what is relevant before a provider receives the request."
      },
      {
        "type": "list",
        "items": [
          "Individuals prepare writing, research, analysis, and coding requests with explicitly selected context.",
          "Teams can use the same disclosure principles for project information, subject to access controls that must be implemented for shared environments.",
          "Developers can build around a consistent request format and explicit provider boundaries."
        ]
      },
      {
        "type": "paragraph",
        "text": "The product follows four principles: separate information domains, minimize disclosure, require meaningful user control, and support interoperable model access. These principles describe design requirements; their effectiveness depends on the implementation and the services involved."
      }
    ]
  },
  {
    "id": "chapter-2",
    "number": "2",
    "title": "Implementation Status",
    "blocks": [
      {
        "type": "paragraph",
        "text": "The current release provides browser-based request preparation and a same-origin, server-side AI gateway. Live inference remains disabled until an operator configures a provider secret, model, approved-user allowlist and activation flag. Automated gateway checks do not replace an authorized live-provider verification."
      },
      {
        "type": "table",
        "caption": "Capabilities and their current boundary",
        "columns": [
          "Capability",
          "Current implementation",
          "Additional requirement"
        ],
        "rows": [
          [
            "Prompt and context preparation",
            "Local editing, selected context and selected conversation turns",
            "User review of sensitive content"
          ],
          [
            "Privacy filtering",
            "Local pattern masking for common emails and phone numbers; manual selection masking",
            "Broader detection and evaluated accuracy"
          ],
          [
            "Request approval",
            "Approval of a cloned payload snapshot; edits invalidate approval",
            "Continued regression checks on every sending path"
          ],
          [
            "Context persistence",
            "Memory by default; optional unencrypted browser storage",
            "Protected storage for stronger confidentiality"
          ],
          [
            "Sessions",
            "Local clearing and invalidation of late UI responses",
            "Provider-specific cancellation and retention verification"
          ],
          [
            "Wallet access",
            "Browser wallet connection, switching, and RPC balance reads",
            "No payment execution is implemented"
          ],
          [
            "Live model access",
            "Server-side gateway with secret configuration, model pinning and account allowlist",
            "Provider configuration, spend limits and authorized live end-to-end verification"
          ],
          [
            "Confidential computing",
            "Architectural requirement",
            "Execution environment, attestation and key-release implementation"
          ],
          [
            "Usage settlement and token access",
            "Proposed architecture",
            "Contract specifications, deployment and security review"
          ]
        ]
      },
      {
        "type": "paragraph",
        "text": "The whitepaper does not establish deployment of a token contract, payment service, confidential inference environment, or verified production inference service. Website interactions and explanatory animations are not evidence of those services."
      }
    ]
  },
  {
    "id": "chapter-3",
    "number": "3",
    "title": "Four Information Boundaries",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Anonyx separates four information domains. Separation means restricting what one domain receives from another, rather than assuming different components cannot be correlated."
      },
      {
        "type": "table",
        "caption": "Architecture boundaries",
        "columns": [
          "Layer",
          "Responsibility",
          "Disclosure rule"
        ],
        "rows": [
          [
            "Identity",
            "Wallet or service authentication when a capability requires it",
            "Do not append identity fields to an AI payload by default"
          ],
          [
            "Context",
            "User-managed information and explicit request selection",
            "Keep unselected items outside the request"
          ],
          [
            "Inference",
            "Chosen model/provider and the approved request",
            "Transmit only approved fields through an explicit destination"
          ],
          [
            "Payment",
            "Proposed funding, authorization and settlement",
            "Keep prompt content off chain; assess financial correlation separately"
          ]
        ]
      },
      {
        "type": "paragraph",
        "text": "For ordinary request preparation, a wallet is not required. The current payload builder receives selected content and model information, not wallet account state. A name, wallet address, or account identifier typed into a prompt is still included as text unless the user removes it."
      },
      {
        "type": "paragraph",
        "text": "A separate provider origin is an application isolation boundary. It does not hide a user’s IP address from that service, stop a provider from reading submitted content, or prevent correlation through login, timing, cookies, or payments."
      }
    ]
  },
  {
    "id": "chapter-4",
    "number": "4",
    "title": "A Request from Draft to Disclosure",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Consider a user preparing a client project summary. The context library contains a project goal, writing preferences, a contact list, and unrelated project notes. Only the goal and writing preferences are needed for this task."
      },
      {
        "type": "paragraph",
        "text": "Draft → Select context → Inspect payload → Approve → Send to the chosen provider"
      },
      {
        "type": "table",
        "caption": "Worked request example",
        "columns": [
          "Step",
          "User choice",
          "Result"
        ],
        "rows": [
          [
            "Draft",
            "“Write a concise summary of the project goal.”",
            "Text is prepared in the browser"
          ],
          [
            "Select",
            "Choose the project goal and writing preferences",
            "Contact list, unrelated notes and prior turns remain excluded"
          ],
          [
            "Mask",
            "Remove contact details if they appear in the prompt or selected text",
            "Review for identifiers the pattern tool may miss"
          ],
          [
            "Inspect",
            "Read the actual messages and destination",
            "Selected item titles and bodies appear in the payload"
          ],
          [
            "Approve",
            "Approve this exact snapshot",
            "Changing effective request content requires a fresh approval"
          ],
          [
            "Execute",
            "Use a configured, verified provider integration",
            "Provider receives the approved text and applies its own policies"
          ]
        ]
      },
      {
        "type": "paragraph",
        "text": "The approved payload contains the current prompt, selected context, selected conversation turns where applicable, and model/provider fields. Context inventory metadata and connected wallet fields are not automatically included. Selected context titles may themselves contain sensitive information and must be reviewed."
      },
      {
        "type": "paragraph",
        "text": "If external execution is unavailable, the interface must explain that at the point of execution. It must not manufacture an AI answer, a payment receipt, or a successful transaction. If a request fails or times out, another attempt requires a deliberate user action; uncertain completion must not be treated as success."
      }
    ]
  },
  {
    "id": "chapter-5",
    "number": "5",
    "title": "Context Ownership and Storage",
    "blocks": [
      {
        "type": "paragraph",
        "text": "The context library lets users organize information independently from an individual model provider. Users can create, edit, delete, import and export context, then select only the items relevant to a request. The current selection mechanism is explicit user choice, not automatic semantic retrieval."
      },
      {
        "type": "paragraph",
        "text": "Context and active conversation history start unselected for request inclusion. Selected item titles and bodies become request content. Selecting an item grants permission to use that item for the reviewed request; it is not permission to upload the entire library."
      },
      {
        "type": "table",
        "caption": "Storage behavior",
        "columns": [
          "Data",
          "Default location",
          "Important limit"
        ],
        "rows": [
          [
            "Draft and active conversation",
            "Browser tab memory",
            "Visible to the active application and potentially a compromised browser"
          ],
          [
            "Context library",
            "Browser memory",
            "Not an encrypted vault"
          ],
          [
            "Remembered context",
            "Optional unencrypted local browser storage",
            "Accessible within the same browser profile and origin; unsuitable for unprotected secrets"
          ],
          [
            "Exported context",
            "User-created JSON download",
            "Outside session deletion; requires separate handling"
          ],
          [
            "Provider records",
            "Provider infrastructure after sending",
            "Governed by provider terms and technical controls"
          ]
        ]
      },
      {
        "type": "paragraph",
        "text": "There is no Anonyx cloud context synchronization in the current release. Encrypted persistence, team permissions, and semantic retrieval are possible extensions, each requiring its own key management, authorization, and disclosure policy. Encryption alone would not protect context while it is displayed or processed by a compromised application."
      }
    ]
  },
  {
    "id": "chapter-6",
    "number": "6",
    "title": "Privacy-Aware Prompt Processing",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Prompt processing reduces unnecessary disclosure before transmission. The current tool masks common email and phone-number patterns locally and allows selected text to be replaced manually. The resulting text remains editable and must be inspected before approval."
      },
      {
        "type": "paragraph",
        "text": "Pattern masking can miss names, addresses, API keys, unusual formats, combinations of facts, and identifiers embedded in context titles. It can also mask non-sensitive numbers. It is a convenience control, not a comprehensive sensitive-data detector or a guarantee of de-identification."
      },
      {
        "type": "list",
        "items": [
          "Review both the prompt and every selected context item.",
          "Remove credentials and private keys rather than relying on automatic detection.",
          "Check whether remaining project details can identify a person or organization.",
          "Use only the information needed for the task and assess the provider’s policies before sending it."
        ]
      },
      {
        "type": "paragraph",
        "text": "Future filtering should be evaluated against representative data, with documented false positives, missed identifiers, supported languages, and processing location. If a remote service performs the filtering, that service becomes an additional recipient and must be disclosed before use."
      }
    ]
  },
  {
    "id": "chapter-7",
    "number": "7",
    "title": "Sessions and Deletion",
    "blocks": [
      {
        "type": "paragraph",
        "text": "A private session limits locally retained working state. Ending a session clears the current draft, transcript and request selections, resets active workflow output, and prevents late responses from repopulating cleared UI state. Context-library management remains a separate operation."
      },
      {
        "type": "paragraph",
        "text": "Session clearing is not secure erasure of browser memory and does not remove remembered context, downloaded exports, browser records, hosting metadata, wallet-provider records, or external model-provider logs. Users must delete saved context separately and apply the relevant controls for other recipients."
      },
      {
        "type": "paragraph",
        "text": "Stopping a request or closing a provider window does not prove that upstream computation was cancelled. A provider may already have received the payload or incurred usage charges. An integration must disclose its cancellation behavior and distinguish local cancellation from confirmed upstream cancellation."
      },
      {
        "type": "paragraph",
        "text": "Future temporary credentials and short-lived service sessions should have explicit expiry, revocation and logging policies. Limited persistence must be described per component rather than promised for the entire system."
      }
    ]
  },
  {
    "id": "chapter-8",
    "number": "8",
    "title": "Models, Routing and Multi-Model Workflows",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Anonyx is designed to support models suited to different tasks, such as writing, coding, reasoning and analysis. The current local model profiles organize request preparation; they do not establish availability or performance of a live model. A connected provider catalog must supply verified model and provider identifiers."
      },
      {
        "type": "paragraph",
        "text": "Routing should preserve the reviewed destination. A provider must not be silently substituted after approval. If a model becomes unavailable, a different model or provider requires a new review rather than an automatic fallback that changes the disclosure boundary."
      },
      {
        "type": "paragraph",
        "text": "Generate → Critique → Refine"
      },
      {
        "type": "paragraph",
        "text": "A multi-model workflow can ask one model for an initial response and another to critique or refine it. Every stage must identify its recipients and the text it will receive, including earlier model output. Sharing a response with another provider is a further disclosure, even if the original prompt is omitted."
      },
      {
        "type": "paragraph",
        "text": "The current workspace provides stage controls and request preparation. Any claims about live output quality, task-routing performance, service latency, or costs require a verified integration and measurement. Model output remains untrusted information and should not authorize tools, reveal secrets, or alter the user’s disclosure policy."
      }
    ]
  },
  {
    "id": "chapter-9",
    "number": "9",
    "title": "Developer Integration and Verification",
    "blocks": [
      {
        "type": "paragraph",
        "text": "The developer-facing layer provides request JSON validation and export. The workspace also has a server-side gateway for an operator-configured OpenAI-compatible provider. This gated integration is not a public developer inference API, API credential service or durable usage-accounting backend."
      },
      {
        "type": "paragraph",
        "text": "The workspace gateway uses a server-held provider key and a fixed operator-configured HTTPS endpoint and model. It validates authenticated account access, same-origin requests, explicit approval and message limits, and strips unrecognized request fields. Client cancellation, timeouts and sanitized errors preserve the draft without automatic retries. The per-instance burst guard is not a durable global quota; provider spend limits and live integration verification remain required."
      },
      {
        "type": "list",
        "items": [
          "Validate request schema and sizes at every service boundary.",
          "Bind authorization to the approved payload and destination; reject stale or changed requests.",
          "Keep API secrets outside browser-visible configuration and public request exports.",
          "Prevent unauthorized origins from opening a request channel.",
          "Specify retry and idempotency behavior to avoid duplicate inference or charges.",
          "Define log fields, retention and deletion behavior without recording prompt content by default."
        ]
      },
      {
        "type": "paragraph",
        "text": "The current source includes automated tests for payload selection, review snapshot isolation, context import/export rules, wallet switching, disclosure-animation behavior and gateway authorization, validation, cancellation and sanitized failures. Provider calls in gateway tests use controlled stubs. Passing these tests does not prove real provider availability, provider non-retention, deployed confidential computing, browser-extension safety or anonymous payment."
      },
      {
        "type": "paragraph",
        "text": "A public release should expose the relevant source version, integration configuration boundaries, test results and external review findings. Claims should point to evidence for the same deployed release."
      }
    ]
  },
  {
    "id": "chapter-10",
    "number": "10",
    "title": "Privacy Threat Model",
    "blocks": [
      {
        "type": "paragraph",
        "text": "The protected information includes prompts, context, conversation history, credentials, identity, and links between usage and payment. Anonyx aims to reduce unintended disclosure of unselected content and unnecessary identity fields. It does not currently provide protection against every party that can observe an interaction."
      },
      {
        "type": "table",
        "caption": "Threats, controls and remaining assumptions",
        "columns": [
          "Threat or observer",
          "Current protection",
          "Remaining exposure"
        ],
        "rows": [
          [
            "Unintended context sharing",
            "Explicit selection and exact-payload approval",
            "Sensitive details can remain in selected text or titles"
          ],
          [
            "Changed request after approval",
            "Cloned review snapshot and approval invalidation",
            "All sending paths and destination changes must retain these checks"
          ],
          [
            "Model provider",
            "Only selected content is included",
            "Provider can read approved content and may retain it under its policies"
          ],
          [
            "Hosting or network metadata",
            "No added product analytics or prompt logging",
            "Hosting can observe IP addresses and page-request metadata"
          ],
          [
            "Wallet, RPC and blockchain observers",
            "Wallet state is separate from AI payload construction",
            "Wallet/RPC requests and public transactions can reveal identity or activity"
          ],
          [
            "Compromised device, extension or delivered code",
            "Limited retention and explicit storage choice",
            "Application-level controls cannot protect text from a compromised environment"
          ],
          [
            "Timing or identifier correlation",
            "Data minimization",
            "Separate services may still link activity by login, IP, timing or repeated details"
          ],
          [
            "Malicious context or model output",
            "User-visible review and selection",
            "Content may influence model behavior; no complete prompt-injection defense is claimed"
          ]
        ]
      },
      {
        "type": "paragraph",
        "text": "Users trust the browser and delivered application code for local processing, hosting to deliver that code, and any chosen provider to honor its declared policies. A separate origin narrows access between application components but does not remove those trust assumptions."
      },
      {
        "type": "paragraph",
        "text": "Stronger privacy requires specified mechanisms and measured results. A claim of anonymous inference, zero retention or payment unlinkability needs evidence beyond the absence of a wallet address in the prompt."
      }
    ]
  },
  {
    "id": "chapter-11",
    "number": "11",
    "title": "Confidential Computing Requirements",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Confidential computing is a proposed capability for sensitive request processing or inference. It is not deployed or verified by the current Anonyx workspace. A protected intermediary would not protect text from a downstream provider if that intermediary forwards the text in plaintext."
      },
      {
        "type": "paragraph",
        "text": "For a future confidential execution mode to support meaningful claims, the protected workload and its remaining exposure must be explicit. Context transformation, routing and complete model inference have different boundaries and cannot share one undifferentiated privacy label."
      },
      {
        "type": "list",
        "items": [
          "Identify the execution technology, operator, hardware and protected workload.",
          "Publish the software measurement and the policy used to verify attestation freshness and authenticity.",
          "Define how encryption keys are released only to an approved measured workload.",
          "Document ingress, egress, logging, crash-reporting and retention behavior.",
          "Specify update, revocation, outage and recovery behavior.",
          "Assess hardware, operator, side-channel and availability assumptions through independent review."
        ]
      },
      {
        "type": "paragraph",
        "text": "Attestation can provide evidence about an execution environment under specific assumptions. It does not automatically prove that software is correct, that every output is private, or that metadata cannot be correlated. Confidential mode should fail closed when its verification requirements are not met, rather than silently send the same data through a weaker path."
      }
    ]
  },
  {
    "id": "chapter-12",
    "number": "12",
    "title": "Private Usage and Blockchain Infrastructure",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Anonyx’s intended usage architecture separates funding, authorization, computation and settlement. The aim is to authorize resource consumption without placing prompt content or an unnecessary identity profile into each inference request."
      },
      {
        "type": "paragraph",
        "text": "Funding → Authorization → Computation → Settlement"
      },
      {
        "type": "paragraph",
        "text": "Robinhood Chain is the intended network for EVM-compatible token accounting and programmable access components. The current website supports wallet connectivity and RPC reads. No Anonyx settlement contract, private balance, payment execution, or deployed usage-authorization protocol is established by this paper."
      },
      {
        "type": "paragraph",
        "text": "Prompt text, context, conversation history, and personally identifying request details should not be placed on chain. Even hashes of predictable sensitive data can permit confirmation attacks and should not be treated as private storage."
      },
      {
        "type": "paragraph",
        "text": "Public blockchain activity is observable. Separating payment software from inference software does not by itself make payments unlinkable. Any future privacy-preserving authorization design must specify the credential mechanism, issuer and verifier knowledge, replay prevention, revocation, accounting and correlation risks."
      },
      {
        "type": "paragraph",
        "text": "A usage service also needs a clear quote, spending authorization, completion state and reconciliation policy. Timeouts, partial workflows, refunds and duplicate requests must have defined behavior before users can rely on settlement."
      }
    ]
  },
  {
    "id": "chapter-13",
    "number": "13",
    "title": "Token Utility and Economic Design",
    "blocks": [
      {
        "type": "paragraph",
        "text": "The proposed Anonyx token is intended to support eligible resource access, developer services, ecosystem participation and contributor incentives. Each utility depends on a deployed service or protocol mechanism; holding a token alone does not create access to unimplemented infrastructure."
      },
      {
        "type": "paragraph",
        "text": "Anonyx plans to launch its token through Pons V2 on Robinhood Chain. The ticker, selected launch configuration, pairing asset, fees, creator recipient, developer purchases and token address must be published when confirmed. A platform launch does not deploy Anonyx’s AI services or usage-settlement mechanisms."
      },
      {
        "type": "heading",
        "text": "Launch distribution"
      },
      {
        "type": "paragraph",
        "text": "Pons V2 mints the full supply to its curve, including a reserve for graduation into locked Uniswap V4 liquidity. Supply and reserve amounts follow the selected configuration. No separate Anonyx team or treasury allocation is specified."
      },
      {
        "type": "paragraph",
        "text": "Optional Pons V2 buybacks vest tokens rather than burn them. Anonyx has not confirmed buyback settings or a burn policy."
      },
      {
        "type": "paragraph",
        "text": "Platform reference: https://docs.ponsfamily.com/v2. Launch terms must be checked at creation; earlier platform defaults are not Anonyx commitments."
      },
      {
        "type": "heading",
        "text": "Project holdings and operating funds"
      },
      {
        "type": "paragraph",
        "text": "Any developer purchase or later acquisition for project operations must be disclosed separately from initial distribution, with the relevant wallets and funding source. A project-held token balance is not automatically a vested allocation. Any vesting claim needs a specified schedule and enforceable mechanism."
      },
      {
        "type": "paragraph",
        "text": "Anonyx has not assigned percentages of creator receipts to development, operations, rewards or holders. Operating budgets, accounting and treasury permissions must be specified before such commitments are made. Trading liquidity must not be presented as an available project operating budget."
      },
      {
        "type": "table",
        "caption": "Economic questions requiring specification",
        "columns": [
          "Mechanism",
          "Required publication"
        ],
        "rows": [
          [
            "Service pricing",
            "How provider cost, platform fees and token volatility affect quotes"
          ],
          [
            "Access authorization",
            "Which features require payment or token holdings and how this is enforced"
          ],
          [
            "Launch and holdings",
            "Selected configuration, distribution reserves, project purchases, recipient wallets and any separately implemented vesting"
          ],
          [
            "Contributor incentives",
            "Eligibility, reward calculation, budget and abuse resistance"
          ],
          [
            "Governance",
            "Eligible decisions, voting rules and administrative permissions"
          ],
          [
            "Contract controls",
            "Upgradeability, emergency powers, security reviews and deployment evidence"
          ]
        ]
      },
      {
        "type": "paragraph",
        "text": "Where adopted, supported payment assets and service credits should be distinguished from the ecosystem token. The final economic design must explain which asset funds a request and how usage is accounted for. No conversion rate or credit balance is established by the current release."
      },
      {
        "type": "paragraph",
        "text": "The token is described as a proposed utility asset, not equity, ownership of an AI provider, a guaranteed entitlement to revenue, or a promise of appreciation."
      }
    ]
  },
  {
    "id": "chapter-14",
    "number": "14",
    "title": "Delivery and Evidence Roadmap",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Progress should be communicated through verifiable capabilities rather than unsubstantiated release dates. The stages below describe intended acceptance requirements, not a commitment that these systems have already been delivered."
      },
      {
        "type": "table",
        "caption": "Delivery requirements",
        "columns": [
          "Stage",
          "Scope",
          "Evidence needed"
        ],
        "rows": [
          [
            "Local disclosure controls",
            "Selection, masking, payload review, context management and session clearing",
            "Source review, regression checks and usable request receipts"
          ],
          [
            "Verified provider access",
            "Live catalog, authentication, reviewed inference and workflow stages",
            "End-to-end checks for destinations, errors, charges, cancellation and retention disclosures"
          ],
          [
            "Protected context",
            "Optional encrypted storage and controlled retrieval",
            "Key lifecycle, recovery policy, selection behavior and independent assessment"
          ],
          [
            "Usage authorization",
            "Quotes, resource budgets and settlement",
            "Protocol specification, deployed contract verification, replay protection and reconciliation checks"
          ],
          [
            "Confidential execution",
            "Measured sensitive-processing or inference workload",
            "Attestation policy, key-release tests, operator disclosure and independent security review"
          ]
        ]
      },
      {
        "type": "paragraph",
        "text": "Each release should identify what changed, which controls were verified and what remains outside its guarantees. Security findings and provider-policy changes should be reflected in the website and technical documentation. Publishing source or passing continuous-integration checks is evidence of transparency and specific behavior, not a substitute for an audit."
      }
    ]
  },
  {
    "id": "chapter-15",
    "number": "15",
    "title": "Limitations and Disclaimer",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Anonyx’s practical privacy benefit is reducing unnecessary sharing and making disclosure deliberate. It cannot guarantee that external AI systems will never retain or share data. Users must assess the sensitivity of approved text and the conditions of each service that receives it."
      },
      {
        "type": "paragraph",
        "text": "The current implementation has no independently verified confidential inference, cryptographic payment unlinkability, encrypted context vault, production Anonyx API, or deployed settlement system. Proposed capabilities require implementation, configuration and verification before they can support operational claims."
      },
      {
        "type": "paragraph",
        "text": "Browsers, wallets, hosting providers, RPC services, model providers, blockchain networks and confidential-computing operators introduce separate risks and trust assumptions. Security controls can fail, providers can change their policies, and AI output can be incorrect or manipulated."
      },
      {
        "type": "paragraph",
        "text": "This document is a technical and product description. It is not financial, investment, legal, tax or other professional advice, and it does not establish contractual service guarantees. Readers should independently evaluate the technology, applicable requirements and risks before using services or acquiring any ecosystem asset."
      },
      {
        "type": "paragraph",
        "text": "This revision preserves Anonyx’s privacy-focused AI concept while specifying its present boundaries. Future claims must be supported by the mechanisms and evidence described in the relevant chapters."
      }
    ]
  }
];
