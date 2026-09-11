# Architecture

## Lifecycle

`create_service` → `define_commitment` → `activate_service` → `open_incident` → `submit_observation` (repeatable) → `respond_to_incident` → optional `challenge_observation` → `resolve_incident` → optional `appeal_incident` → `resolve_appeal` → `close_incident` → `archive_service`

## Evidence model

Resolution is a deterministic evidence-comparison mechanism, not an LLM-judged one — there is no `gl.nondet.exec_prompt` call anywhere in this contract. `leader_fn`/`validator_fn` each independently:

1. Fetch DNS-over-HTTPS from `dns.google`, requiring the response's own `Question` field to echo the locked hostname before anything else is trusted (Rule 0.8-style identifier binding).
2. Fetch the locked endpoint live via `gl.nondet.web.request`.
3. Classify the result into one of four outcomes: `INCONCLUSIVE` (binding failed), `SLA_MET` (binding held, code matched), `SLA_BREACHED` (binding held, fetch unreachable), `PARTIAL_BREACH` (binding held, code didn't match).

Every validator independently re-derives the outcome, the binding result, and the HTTP code, and rejects if any of the three don't match the leader's own values — never just checking the coarse verdict bucket.

## Challenge mechanic

Opening a challenge (`challenge_observation`) is not cosmetic. The very next resolution round for that incident requires the DNS binding check to succeed **twice**, sequentially, within the same call, rather than once. This raises the evidentiary bar specifically when a party has disputed the evidence, without depending on any DNS provider's custom-header-gated JSON API (a design constraint documented in the contract's own module docstring).

## Observation cross-check

`submit_observation` lets the claimant log timestamped HTTP-code readings during the incident window. At resolution, these are bucketed into a status class (`OK` / `ERROR` / `UNREACHABLE`) alongside the fresh, live-fetched result, and an agreement ratio is stored on the incident. This ratio is informational only — it never gates the outcome enum itself.

## Reputation ledger

A second, structurally distinct entity, `ProviderReputation`, is keyed by a normalized (lowercase) provider address and updated on every terminal resolution (`RESOLVED` or `APPEAL_RESOLVED`). It tracks `resolved_count` and a per-outcome bucket count exactly; a `score` field is a floor-at-zero standing value derived from a fixed, deterministic per-outcome delta table. If an incident is later appealed, `resolve_appeal` reverses the initial round's own count contribution before applying the appeal's fresh one — the ledger's `score` is the one field deliberately not reversed on appeal, since it is not always exactly invertible once other incidents exist in between.
