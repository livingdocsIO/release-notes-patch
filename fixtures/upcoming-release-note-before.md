---
title: release-2021-09
description: Release notes for release-2021-09
---

## PRs to Categorize

**Attention:** If you skipped one or more releases, please also check the release-notes of the skipped ones.

# Breaking Changes :fire:

#### Migrate the database

```sh
# run grunt migrate to update to the newest database scheme
# migration - 111-add-comments-table.js
#   create comments table + add events to the stream_events_types table
livingdocs-server migrate up
```

  ---
  **Icon Legend**
  * Breaking changes: :fire:
  * Feature: :gift:
  * Bugfix: :beetle:
  * Chore: :wrench: