---
title: "Installation"
description: "Install prerequisites, clone Gonex, build the CLI, and resolve an unpublished local framework checkout."
order: 2
version: "main"
source: "getting-started.md"
---

## Prerequisites

Use **Go 1.27.1**, the baseline declared in the current repository, and Git. Dependency resolution requires network access or a populated module cache. Gonex has no published release yet.

## Clone the framework

```sh
git clone https://github.com/amkargar/gonex.git
cd gonex
```

## Build the CLI

On macOS and Linux:

```sh
go build -o gonex ./cmd/gonex
./gonex --help
```

On Windows:

```powershell
go build -o gonex.exe ./cmd/gonex
.\gonex.exe --help
```

Put the built executable on your PATH. Do not use `@latest` or assume the scaffold's default v0.1.0 has been published.

## Resolve local development projects

Generated projects need an explicit local checkout override while the release is unpublished. In your generated project, replace the example with your absolute checkout path:

```sh
go mod edit -replace=github.com/amkargar/gonex=/path/to/gonex
go mod tidy
```

The generator does not insert machine-specific paths. Before deployment, remove that override and resolve a published version when available. Microservices have a separate contracts module that must also resolve.

## Run your first application

Continue to [Quick start](/docs/main/quick-start/) for the runnable example and typed endpoint program.

