---
title: "Contribute to Gonex"
description: "Set up the Gonex framework repository, understand its internals and contribute tested changes to the framework itself."
order: 0
version: "main"
section: "contribute"
group: "START CONTRIBUTING"
---

This section is for developing **Gonex itself**: its application lifecycle, typed transports, generators, integrations and release tooling.

If you want to build your own website or API, start with **[Build with Gonex](/docs/main/)**. Installing the package in an application does not require a fork of the framework.

## Contributor path

1. [Set up the framework repository](/docs/main/contribute/development-setup/).
2. Read [Framework internals](/docs/main/contribute/architecture/) before choosing where a change belongs.
3. [Run the relevant tests and checks](/docs/main/contribute/testing/).
4. [Prepare a focused pull request](/docs/main/contribute/pull-requests/) with a clear problem and actual verification results.
5. Maintainers use [Maintaining releases](/docs/main/contribute/releases/) for release gates and compatibility policy.

## Useful contributions

Bug fixes with reproductions, clearer consumer examples, better error messages, stronger typed-contract validation and focused tests can all be useful. For a larger public API or architectural change, open an issue to discuss the behavior and compatibility implications before committing to an implementation.

The upstream source repository is [amkargar/gonex](https://github.com/amkargar/gonex). This documentation website lives separately in [amkargar/GoNex-website](https://github.com/amkargar/GoNex-website). Submit framework changes to the former and website/docs presentation changes to the latter.
