# Deliver Identity profile (Refs #18)

1. Merge reviewed spec PR; create feat/18-identity-profile isolated worktree from that spec-bearing master.
2. Copy only approved public Markdown and inspected PDF to public/profile; write SHA256 metadata. Never stage original documents/tmp.
3. Add profile data constants and IdentityProfile with safe block renderer, native downloads, loading/retry, awaited clipboard and selectable fallback. Integrate only Identity in Library and add scoped responsive styles.
4. Add check-profile build gate (existence, hashes, PDF header, privacy markers) and negative tests. Add Playwright spec for content/downloads/clipboard/fetch failure and narrow layout.
5. Install dependencies, build, run focused E2E and relevant regressions; inspect PDF; independent code review, fix and rerun. PR includes quoted evidence and rollback, Refs #18.
6. Squash merge only after checks/review. Check Actions and fetch live /identity, Markdown and PDF; compare bytes and test copy in browser before reporting published.
