---
title: "Install Gonex and its CLI"
description: "Install Gonex as a Go library and project-local development tool, then generate an API application without cloning the framework."
order: 10
version: "main"
section: "build"
group: "GETTING STARTED"
---

## Requirements

Use **Go 1.27.2** and a configured Go module proxy or dependency cache. Gonex is installed into your own project; you do not clone the framework to build an API. There is no published release yet: these commands pin the reviewed development commit `3ca54b46cb42`.

## Install the bootstrap CLI

```sh
go install github.com/amkargar/gonex/cmd/gonex@3ca54b46cb42
gonex --version
```

Ensure Go's binary directory is on PATH: `GOBIN`, or `GOPATH/bin` when GOBIN is unset. `go env GOBIN GOPATH` prints those locations. On Windows the executable is `gonex.exe`. If your shell cannot find it, add the installation directory to PATH and reopen the shell.

## Generate your own application

```sh
gonex new shop --module example.com/acme/shop
cd shop
go mod tidy
go tool gonex create module users
go tool gonex run
```

Choose your application's Go module path. The installed CLI uses its actual module version as the generated framework dependency, including pseudo-versions. No unpublished default release is assumed. A locally built CLI must receive an explicit valid `--framework-version VERSION`.

## Project-local development tool

The generated `go.mod` includes both a Gonex requirement and:

```go
tool github.com/amkargar/gonex/cmd/gonex
```

Continue with **`go tool gonex` inside the application**. Go selects the project's CLI version, avoiding accidental use of another global CLI. This is a development tool dependency tracked in go.mod/go.sum; it does not link the CLI into your server binary. Framework and CLI share one module version. See [Go tool dependencies](https://go.dev/doc/modules/managing-dependencies).

## Add the library to an existing application

From the existing module root:

```sh
go get github.com/amkargar/gonex@3ca54b46cb42
```

Add your Gonex imports and explicit application/module composition, then run `go mod tidy`. Installing a dependency does not replace an existing HTTP server automatically. You can also track the CLI in an existing Go module:

```sh
go get -tool github.com/amkargar/gonex/cmd/gonex@3ca54b46cb42
```

The minimum Go patch and dependency versions include security fixes. Use the reviewed snapshot rather than an older development commit, and consult [production readiness](/docs/main/production-readiness/) for the current release decision.

## Check the selected dependency

```sh
go list -m github.com/amkargar/gonex
go tool gonex --version
```

Use actual published tags once available, or reviewed commits while the framework is in development. Keep go.mod and go.sum with your application. Go resolves commit references into canonical pseudo-versions.

Continue with [Quick start](/docs/main/quick-start/). Framework checkout/replacement instructions belong only in [Contribute](/docs/main/contribute/development-setup/).
