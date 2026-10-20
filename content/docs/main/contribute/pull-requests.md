---
title: "Prepare a contribution"
description: "Prepare focused Gonex framework pull requests with reproductions, relevant tests, compatible contracts and clear verification notes."
order: 40
version: "main"
section: "contribute"
group: "MAINTAIN"
---

## Choose the right repository

Framework behavior, Go APIs, CLI generation and runtime adapters belong in [amkargar/gonex](https://github.com/amkargar/gonex). Website navigation, visual design and the consumer/contributor guides belong in [amkargar/GoNex-website](https://github.com/amkargar/GoNex-website).

## Describe the problem first

For a bug, include a small reproduction and the expected versus observed behavior. For a feature, explain the application need and compatibility consequences. Discuss broad API changes in an issue before building a large implementation.

## Keep changes focused

- Preserve ordinary Go composition and explicit module registration.
- Keep business-domain examples independent of Gin, GORM or Protobuf where those details belong in adapters.
- Preserve handwritten application code when changing generators.
- Update relevant consumer docs when public behavior changes.
- Treat contract baselines as reviewed compatibility evidence, not files to regenerate merely to silence a failing check.

## Check and review the diff

Run the relevant [verification commands](/docs/main/contribute/testing/), inspect generated output and keep unrelated formatting or refactors out of the change. A small, complete change is easier to review than a broad partial implementation.

## Open the pull request

Push your branch to your fork and open a pull request against the intended upstream branch. Explain the user-visible result, the implementation decision that matters to a reviewer, and the checks actually run. Include limitations or skipped platform/database checks. Never include tokens, credentials or local absolute-path overrides.

## Release work is separate

Merging a change does not by itself publish a framework version. Maintainers follow [release gates](/docs/main/contribute/releases/) and explicitly review publication.
