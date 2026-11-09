# Identity public profile (Refs #18)

## Context and approved boundary
The owner approved publishing the already privacy-checked public introduction, a PDF, Markdown and copy-for-Agent control inside the existing Identity volume. Private documents and tmp research are excluded. No new route/book, user memory, analytics or third-party course exports.

## Single source and UI
`public/profile/hang-yu.md` is the canonical reviewed introduction. Identity renders its restricted Markdown (headings, paragraphs, bullet lists, bold and quotation; never raw HTML). Static PDF comes from that source; a manifest binds SHA256 of Markdown and PDF. Literal URLs in `src/data/profile.ts` allow existing reference checks. A build-time profile checker rejects absent, altered/stale files and known private markers; its check is supplementary, not a security guarantee.

A dedicated IdentityProfile inside Library DetailPanel replaces only Identity's generic guide. Preserve photo/social links, other volumes, routing and shelf positions. Three native controls: PDF download, Markdown download, copy for Agent. Only a successful awaited Clipboard API write announces copied. Load failure exposes retry and no copy; rejected/unavailable clipboard opens a selectable readonly Markdown fallback. Status feedback is polite, controls keyboard accessible, narrow controls wrap and final text remains reachable.

## Public text
Use the owner-reviewed local `2026-11-09-hang-yu-profile.md` exactly: name; engine/rendering and Agent practice; RenderDoc/AgentHarness stage results; claude-bridge prototype; limited UE5 experiment; LearnerTown/灰仓/千面幻城 prototypes; learning workflow; motto; non-impersonation/non-authorization note; three public channel URLs. No local paths, credentials, internal details, private personal data or invented metrics. Copy/download/render share the same source.

## Verification and delivery
Build typecheck/Vite/404/internal links plus profile hashes. PDF must be inspected nonblank; existing reviewed PDF is one A4 page. Playwright covers source text, real download bytes, clipboard success/rejection/unavailable, fetch error/retry and mobile overflow. Independent review at final SHA; squash through PR and verify Pages /identity and static assets after deployment. Revert the implementation commit to roll back; keep issue open (Refs only).
