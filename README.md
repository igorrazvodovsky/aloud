# aloud

An audiobook player for the [LibriVox](https://librivox.org/) public-domain
collection, streaming from the Internet Archive. Originally a learning exercise;
rebuilt in 2026 on the current Vue ecosystem.

## Running it

```sh
npm ci
npm run dev        # dev server
npm run build      # typecheck, then production build
npm run typecheck  # types only
```

## How it is built

- **Vue 3** with `<script setup>` and TypeScript throughout.
- **Pinia** for the library store — the bookshelf, which book is current, and
  per-book listening position.
- **Vite** for the build, with `vite-plugin-pwa` for the service worker.
- **No component library.** Dialogs are `<dialog>` with `showModal()`, the
  playback-speed menu is the Popover API positioned with CSS anchor
  positioning, and the scrubber is `<input type="range">`. Theming is
  `color-scheme` plus `light-dark()` custom properties.

### Structure

```
src/
  api/archive.ts          Typed Internet Archive client; chapter parsing
  stores/library.ts       Pinia store: bookshelf, progress, persistence
  composables/
    usePlayer.ts          Drives the <audio> element
    useMediaSession.ts    Lock screen and OS media controls
    useMediaQuery.ts      Reactive matchMedia
    useKeyboardShortcuts.ts
  components/player/      Scrubber, transport, chapter list, speed and sleep menus
  styles/tokens.css       Colour, type and spacing tokens
```

The single `<audio>` element lives in `App.vue` and is shared with both layouts
through `provide`/`inject`, so the compact and wide players are purely
presentational.

## Notes

- Playback position is persisted per book, throttled, and never includes the
  Internet Archive response.
- `npm ci` runs in CI on every push and pull request. Dependabot is configured
  to group minor and patch updates and to leave majors alone — those are
  migrations, not merges.
