---
title: "Framework development setup"
description: "Fork and clone Gonex, install its Go toolchain, run the source example and test local framework changes from another app."
order: 10
version: "main"
section: "contribute"
group: "START CONTRIBUTING"
---

## Fork and clone

Install Go 1.27.2 and Git. Fork [amkargar/gonex](https://github.com/amkargar/gonex) in GitHub, then clone your fork (replace `YOUR-USER` with your username):

```sh
git clone https://github.com/YOUR-USER/gonex.git
cd gonex
git remote add upstream https://github.com/amkargar/gonex.git
git switch -c fix/describe-the-change
```

If you are an upstream maintainer, use the upstream clone and your normal branch workflow. The commands in this contributor section run from the **framework repository root**, unlike the application guide.

## Resolve dependencies

```sh
go mod download
go mod verify
```

The repository contains several independent Go modules. Resolving the root module alone does not verify the contracts/integration/microservice modules.

## Run the source example

```sh
go run ./examples/basic
```

In another terminal:

```sh
curl http://127.0.0.1:8080/users/1
```

The example's memory-backed response is `{"id":"1","name":"Ada","email":"ada@example.com"}`. Its health, readiness and OpenAPI routes let you inspect lifecycle and typed-contract behavior. This is a framework-development smoke example, not the default setup for a consumer application.

## Build the CLI you are changing

On macOS/Linux:

```sh
go build -o gonex ./cmd/gonex
./gonex --help
```

On Windows, build `gonex.exe` and invoke it with `.\gonex.exe --help`. A global previously installed CLI will not automatically use your local changes; run the freshly built executable deliberately.

## Exercise changes from a separate app

Keep a consumer app outside the framework checkout. From the consumer app, use an explicit absolute-path replacement:

```sh
go mod edit -replace=github.com/amkargar/gonex=/absolute/path/to/your/gonex
go mod tidy
go test ./...
```

This helps reproduce behavior through public imports. Remove the replacement and resolve a real dependency before deploying that app. See [testing and verification](/docs/main/contribute/testing/) for the framework's own checks.
