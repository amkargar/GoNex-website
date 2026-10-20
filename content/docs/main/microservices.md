---
title: "Microservices"
description: "Develop independent Go services with explicit typed clients, local diagnostics and supervised processes."
order: 130
version: "main"
source: "microservices.md"
section: "build"
group: "APPLICATION DESIGN"
---

[Project home](https://github.com/amkargar/gonex) · [Documentation index](/docs/main/)

Follow [First mapped microservice call](/docs/main/microservices-quickstart/) to install the public CLI, generate independent services, make caller-owned business edits and run with one command after explicit dependency preparation. Monolith remains the simplest default.

Services retain separate go.mod/main.go/config/modules and HTTP/gRPC/mixed/worker listener profiles. Business services use plain Go interfaces; client/transport adapters own protocol mapping. Persistence is optional and belongs to each service.

The strict caller-editable gonex.yaml owns local paths, loopback addresses and declared client edges. go.mod owns versions; .gonex.json owns generator metadata. No secrets, discovery or runtime global injection live in this catalog.

Use doctor then dev with explicit --dev-insecure for local plaintext, or configure real TLS/mTLS. dev builds cached dependencies and supervises direct binaries with prefixed output; it never silently tidies modules or downloads tools. --service starts only the selected process. Logs/readiness confirm availability; configured addresses alone do not.

Client skeletons intentionally fail compilation until mapping/wiring is complete. The example profile supports only the verified starter contract; raw retains manual typed-client bootstrap. Publish actual contracts and pin versions before GOWORK=off deployment. go.work is local convenience, not a deployment dependency.

See [compatibility](/docs/main/microservices-compatibility/), [troubleshooting](/docs/main/microservices-troubleshooting/), [acceptance](https://github.com/amkargar/gonex/blob/main/docs/microservices-dx/acceptance.md) and the [advanced Identity/Orders example](https://github.com/amkargar/gonex/tree/main/examples/microservices). Its labeled source replacements are distinct from the new independently resolved public tutorial.
