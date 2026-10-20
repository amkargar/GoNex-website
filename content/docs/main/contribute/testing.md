---
title: "Framework testing and verification"
description: "Run Gonex formatting, unit, contract, integration, race and benchmark checks without confusing framework tests with application tests."
order: 30
version: "main"
section: "contribute"
group: "DEVELOP THE FRAMEWORK"
---

## Start with the root module

From the framework repository root:

```sh
gofmt -l .
go mod verify
go test ./...
go vet ./...
go build ./...
```

`gofmt -l .` should print no unformatted files. Use `gofmt -w` only on the files you intend to change. Add a focused regression test for a behavioral fix, and run the broader checks appropriate to the packages affected.

## Check independent modules

The root `go test ./...` does not include nested modules. The upstream test workflow also checks:

```sh
go -C contracts test ./...
go -C integration/rpc test ./...
go -C integration/rpc vet ./...
go -C integration/rpc build ./...
go -C examples/microservices/services/identity test ./...
go -C examples/microservices/services/orders test ./...
```

Resolve the relevant modules' dependencies and local-workspace setup before running them. Follow their README files when a service requires additional configuration.

## Typed contracts and generators

```sh
go run ./cmd/gonex grpc check
go run ./cmd/gonex openapi validate --file tests/testdata/basic.openapi.json --against tests/testdata/releases/v0.1.0.openapi.json
```

`tests/testdata/releases/v0.1.0.openapi.json` is a compatibility fixture, not evidence that a v0.1.0 release is published. Generator changes should preserve handwritten files, reject unsafe paths and have repeatable output.

The contracts workflow also installs the pinned Buf tooling, lints and checks Protobuf compatibility, runs generation and verifies that generated files have no unexplained diff. Inspect the [actual contracts workflow](https://github.com/amkargar/gonex/blob/main/.github/workflows/contracts.yml) for its current commands.

## Integration and platform checks

The upstream workflow includes a disposable PostgreSQL service, SQLite integration and a Linux race-detector run. For local race checks on a suitable Go/CGO platform:

```sh
go test -race ./...
```

A test skipped because an external database is unavailable is not a verified database integration. Use the [upstream test workflow](https://github.com/amkargar/gonex/blob/main/.github/workflows/test.yml) as the configuration reference, and report skipped or unexecuted checks honestly.

## Benchmark changes carefully

Use paired workloads on the same machine and retain raw output. The [upstream benchmark methodology](https://github.com/amkargar/gonex/blob/main/docs/benchmarks/README.md) defines workloads and budgets; small local measurements do not establish production throughput.

## Report actual evidence

In a contribution, list the commands you ran, their outcomes and material checks you could not run. Do not report configured CI targets as passed until the hosted runs succeed.
