<div align="center">

# ProofPulse

### Evidence-bound infrastructure reliability disputes, resolved by GenLayer consensus

<br />

![Status](https://img.shields.io/badge/status-live-brightgreen?style=flat-square)
![Network](https://img.shields.io/badge/network-StudioNet-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20GenVM-3C6E71?style=flat-square)

<br />

**[Documentation](./docs/architecture.md)** &nbsp;·&nbsp; **[Smart Contract](./contracts/proofpulse.py)**

</div>

<br />

---

## What this is

A provider locks an HTTPS endpoint and a target HTTP success code before any incident can be opened. A claimant can later open an incident and log timestamped HTTP-code observations during a fixed window. Resolution runs a GenLayer multi-validator consensus round that independently fetches the endpoint fresh and confirms it via DNS-over-HTTPS identifier binding — never trusting a submitter-supplied claim alone.

<br />

<div align="center">

| | |
|---|---|
| **Concept** | Staked-free infrastructure SLA arbitration with a permanent, cross-service reputation ledger |
| **Consensus need** | A provider benefits from a false `SLA_MET` verdict (protects its reliability record); a claimant benefits from a false `SLA_BREACHED` verdict (damages it) |
| **Evidence source** | Live HTTP fetch of the locked endpoint + DNS-over-HTTPS (`dns.google`) identifier binding — never a submitter-described claim |
| **Network** | StudioNet |

</div>

<br />

---

## How it works

1. `create_service` / `define_commitment` / `activate_service` — a provider locks an endpoint and a target HTTP status code before any incident can exist.
2. `open_incident` — a claimant opens a case against a fixed, already-closed observation window.
3. `submit_observation` / `respond_to_incident` / `challenge_observation` — evidence and rebuttal accumulate. **A challenge is not cosmetic**: it raises the evidentiary bar the very next resolution round applies (see below).
4. `resolve_incident` — a GenLayer consensus round independently re-fetches the endpoint and re-confirms DNS binding, producing one of four outcomes: `INCONCLUSIVE`, `SLA_MET`, `PARTIAL_BREACH`, `SLA_BREACHED`.
5. `appeal_incident` → `resolve_appeal` — a genuinely fresh, independent second consensus round, never a re-read of the first round's stored result.
6. `close_incident` / `archive_service` — terminal bookkeeping.

Every resolution also updates a permanent, address-keyed `ProviderReputation` ledger — a durable, cross-service, cross-incident accountability record, queryable via `get_reputation`, independent of any single incident.

<br />

<details>
<summary><b>Why a challenge changes what gets fetched, not just a status flag</b></summary>
<br />

An unchallenged incident's resolution requires DNS-over-HTTPS binding to succeed once. A challenged incident requires it to be independently reconfirmed **twice**, sequentially, within the same resolution call, before the fetched HTTP status is trusted at all. If either binding check fails on a challenged incident, the verdict is forced to `INCONCLUSIVE` regardless of what the HTTP fetch found. This is a deliberately conservative design over a second external DNS authority (e.g. Cloudflare's DoH JSON API), which was considered and rejected because it requires a client-set `Accept` header this project's confirmed nondet fetch helpers have no confirmed support for passing — building on that would risk silently making every challenged incident permanently unresolvable.

</details>

<br />

---

## Deployed contract

<div align="center">

| Network | Address | Explorer |
|---|---|---|
| StudioNet | `0x431607C901544dd33631aA7aC2eA966b29326089` | [View](https://explorer-studio.genlayer.com/address/0x431607C901544dd33631aA7aC2eA966b29326089) |

</div>

<br />

---

## Quick start

```bash
npm install
npm run dev
```

```bash
npm run build
```

The frontend uses `genlayer-js` and is configured for GenLayer StudioNet exclusively — no network toggle, since this project targets one network.

<br />

---

## Project structure

```
contracts/proofpulse.py    The GenVM contract
src/                        React + Vite app
docs/architecture.md        Lifecycle + evidence model
LICENSE                     MIT
```

<br />

---

## Status

<div align="center">

![Tested](https://img.shields.io/badge/nondet%20audit-passed-brightgreen?style=flat-square)
![Untested](https://img.shields.io/badge/live%20multi--validator%20run-not%20yet%20exercised-yellow?style=flat-square)

</div>

The contract passes the full mandatory pre-deploy nondet-safety audit (positional `run_nondet_unsafe`, correct `gl.vm.Return`/`.calldata` handling, no storage-backed objects crossing into nondet closures, no `DynArray` on nested dataclasses, every verdict value traced to a real code branch) and is deployed to StudioNet. The full lifecycle — including a challenged incident's double DNS-binding path, an appeal round, and the reputation ledger's appeal-time count reversal — has not yet been exercised end-to-end against the live deployment with real multi-validator consensus. Treat the contract as statically audited and deployed, not yet as live-verified in the same sense as this project's fully lifecycle-tested contracts.

<br />

---

<div align="center">

Built on [GenLayer](https://genlayer.com)

</div>
