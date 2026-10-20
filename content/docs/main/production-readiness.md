---
title: "Production readiness"
description: "Review Gonex hardening, the standalone PostgreSQL API sample, verification evidence and the remaining production release gates."
order: 195
version: "main"
section: "build"
group: "SHIP YOUR APP"
source: "production-readiness/final-report.md"
---

## Implementation and evidence

Gonex now includes repeatable quality/security/fuzz gates, real PostgreSQL fault tests, cross-process migration checks, bounded telemetry, load/profile tooling, lifecycle regressions and a standalone Orders API rehearsal. The minimum patched toolchain is Go 1.27.2.

This is a **development snapshot**, not a declaration that all production-release gates have closed. Read the [current final report](https://github.com/amkargar/gonex/blob/main/docs/production-readiness/final-report.md) and its linked CI evidence for the actual decision. A configured workflow alone is not a successful hosted run.

## Independent service example

The [Orders API source](https://github.com/amkargar/gonex/tree/main/examples/production) has its own go.mod pinned to a public framework commit, with no local replace/workspace dependency. It demonstrates authenticated create/list/get/update/delete operations, role-based write authorization, validation, offset pagination/status filtering, explicit SQL migrations and OpenAPI.

Its Docker Compose rehearsal starts PostgreSQL and migration/API containers, tests API workflows, interrupts the database, verifies unready behavior and recovery, and checks retained data. Secrets are caller-provided; no default production tokens are generated. Plain database transport is restricted to the disposable private rehearsal network, not a production TLS policy.

## Release gates that still need evidence

- Enforced branch checks and a demonstrated blocked failing PR require repository-owner configuration.
- Private disclosure activation, independent security review and onboarding by an unfamiliar developer require external confirmation.
- A stable/tagged install, signed tag artifacts and a prior-release upgrade/rollback need a reviewed candidate and release decision.
- Short hosted load/soak probes do not certify deployment hardware, production TLS/PostgreSQL latency, long-term maintenance or incident history.

## Deploy deliberately

Use the [deployment guide](/docs/main/deployment/), [security guide](/docs/main/security/) and [logging configuration](/docs/main/logging/). The upstream [promotion checklist](https://github.com/amkargar/gonex/blob/main/docs/production-checklist.md), [support policy](https://github.com/amkargar/gonex/blob/main/docs/support-policy.md) and [troubleshooting guide](https://github.com/amkargar/gonex/blob/main/docs/troubleshooting.md) define operational scope and responsibilities. Do not infer a 10/10 maturity claim from initial technical gates.
