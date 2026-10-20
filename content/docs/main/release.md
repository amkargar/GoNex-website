---
title: "Release status"
description: "Understand the current Gonex development snapshot, dependency pinning and support considerations for application developers."
order: 190
version: "main"
section: "build"
group: "REFERENCE"
---

## Development snapshot

The reviewed framework source has no published release. These guides target a particular `main` commit and show how to pin it as a Go dependency. Do not assume a version mentioned by a generator default is available from a module proxy.

## Choose a dependency deliberately

Use the [installation guide](/docs/main/installation/) to pin the reviewed commit. When release tags become available, select an actual published version and review its changelog, compatibility notes and verification record before upgrading.

## Verify your application environment

The upstream release policy describes configured verification targets and outstanding checks; configured targets alone do not prove runtime support. Check your own operating system, database, TLS/proxy configuration and resource lifecycles. See [deployment](/docs/main/deployment/) and [security](/docs/main/security/).

## Looking for the maintainer checklist?

Framework CI gates, contracts-module releases, generated baselines and release preparation belong in **[Contribute to Gonex → Maintaining releases](/docs/main/contribute/releases/)**.
