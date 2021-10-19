# Scope

This repository provides a npx script to patch the release notes in our documentation repository.

## Use Case 1 - Released Releases

**Goal:** Update the patches section of the release notes so customers know the latest version of a release and what has been fixed

**How:** With every merge to a github branch with the pattern `release-YYYY-MM` on the `livingdocs-server` and `livingdocs-editor`, the script gets the PR information and pushes it to the [patches](https://docs.livingdocs.io/operations/releases/release-2021-09/#patches) section of the release notes in the documentation repository.


## Use Case 2 - Upcoming Release

**Goal:** Add every merge to master to the upcoming release notes to simplify the preparation for the next release

**How:** With every merge to `master` on the `livingdocs-server` and `livingdocs-editor`, the script gets the PR information and pushes it on top of the [upcoming release](https://docs.livingdocs.io/operations/releases/master/) in the documentation repository.

# Usage

## via CLI

```bash
# tag = tag of the patch
# sha = sha of the patch
npx github:DaRaFF/release-notes-patch \
  --token='gh-token' \
  --owner=livingdocsIO \
  --repo=livingdocs-server \
  --sha=29d528db124df6e4fce1b4f9f4232e17d8776ccd \
  --tag=v75.15.5
```

## via CI (drone)

```bash
---
kind: pipeline
type: docker
name: release

steps:
- name: release-notes-patch
  image: livingdocs/node:16
  commands:
    - |
      npx github:livingdocsIO/release-notes-patch \
        --token=$GH_TOKEN \
        --owner=livingdocsIO \
        --repo=livingdocs-server \
        --sha=$DRONE_COMMIT_SHA \
        --tag=$DRONE_TAG
  environment:
    GH_TOKEN:
      from_secret: gh_token

trigger:
  event: [tag]
```
