---
title: "Install the package"
description: "Add Gonex as a dependency to a new or existing Go module without cloning or changing the framework source."
order: 10
version: "main"
section: "build"
group: "GETTING STARTED"
---

## Requirements

Install **Go 1.27.1**, the baseline declared by the current Gonex module. You need access to Go module dependencies through your configured proxy or a populated module cache.

There is no published Gonex release yet. These commands pin the reviewed source commit `670c8c5f427e`, not an invented release tag. Your own project is a separate Go module.

## Add Gonex to a new project

```sh
mkdir my-site
cd my-site
go mod init example.com/my-site
go get github.com/amkargar/gonex@670c8c5f427e
```

Change `example.com/my-site` to your application's module path. Go resolves the commit to a pseudo-version and records the dependency in `go.mod` and `go.sum`. Commit both files with your application.

## Add Gonex to an existing project

Run this command from the directory containing your application's `go.mod`:

```sh
go get github.com/amkargar/gonex@670c8c5f427e
```

Add the imports and application code from [Quick start](/docs/main/quick-start/), then run:

```sh
go mod tidy
go run .
```

Run `go mod tidy` after adding your code; running it before the first Gonex import can remove the unused dependency. Adding a dependency does not automatically replace an existing application's HTTP server. Your executable must construct and run the Gonex application.

## Check the resolved version

```sh
go list -m github.com/amkargar/gonex
```

When an actual release is published, choose and pin its real tag. Do not assume the CLI's default `v0.1.0` has been released. See the [Go dependency guide](https://go.dev/doc/modules/managing-dependencies) for commit and pseudo-version behavior.

## Optional: install the CLI

The library works without the CLI. To generate a structured project, install the CLI at the same reviewed commit:

```sh
go install github.com/amkargar/gonex/cmd/gonex@670c8c5f427e
gonex --help
```

Ensure Go's binary installation directory is on PATH. Follow [Create a project with the CLI](/docs/main/cli/#create-a-project-with-a-resolvable-version) so the generated project also pins a resolvable framework version.

## Use an unpublished checkout

This optional workflow is for developing local changes to Gonex while using it from another project. It is not required for ordinary package installation.

From your application, replace the example with the absolute path to your local framework checkout:

```sh
go mod edit -replace=github.com/amkargar/gonex=/absolute/path/to/gonex
go mod tidy
```

On Windows an example absolute path is `D:/Projects/gonex`. Before deploying, remove the local replacement and resolve the pinned dependency:

```sh
go mod edit -dropreplace=github.com/amkargar/gonex
go mod tidy
```

Local framework setup belongs in [Contribute to Gonex](/docs/main/contribute/development-setup/).
