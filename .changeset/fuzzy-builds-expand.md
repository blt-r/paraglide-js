---
"@inlang/paraglide-js": minor
---

Replace the experimental per-locale framework-output specialization with a
Vite 8+ environment architecture. `experimentalPerLocaleBuild: true` now
generates locale source modules before bundling, builds independent native
Rolldown graphs, supports unminified builds and source maps, and emits
`paraglide-vite-locales.json` without rewriting completed chunks or framework
output.

Remove the private TanStack Start and SvelteKit renderer integrations. Those
frameworks now require public client-variant build and render-selection APIs
before they can compose with experimental per-locale builds.
