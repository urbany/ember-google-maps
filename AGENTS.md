# Agent notes for ember-google-maps

## Big picture
- This is a classic (v1) Ember addon (Octane) that wraps the Google Maps JS API via **contextual components**. The primary component is `GMap`, which yields a hash of map primitives (marker, circle, overlay, etc.).
- Runtime API loading is centralized in the `google-maps-api` service; map primitives are *not* Glimmer components in the usual sense—they are “map components” managed by a custom `MapComponentManager`.

Key files:
- `addon/components/g-map.{js,hbs}`: main `GMap` component + yielded contextual component list.
- `addon/components/g-map/map-component.js`: base class for all map components.
- `addon/component-managers/map-component-manager.js`: lifecycle + reactive updates via effects.
- `addon/services/google-maps-api.js`: loads the Maps script and exposes `google`.

## How components work here
- Each map component is a class extending `MapComponent` (or `TypicalMapComponent`) and implements:
  - `setup(options, events)` (required)
  - `update(mapComponent, options)` (optional; preferred for incremental updates)
  - `teardown(mapComponent)` (cleanup; base class removes listeners and `setMap(null)`)
  - `name` getter to control where it’s stored/registered (see examples under `addon/components/g-map/*`).
- Parent/child wiring happens through `@getContext` (see `GMap`’s `getComponent` action). Children call `args.getContext(this.publicAPI, this.name)` in `MapComponent.register()`.

## Args, options, and events conventions
- Args are split by `OptionsAndEvents` (`addon/utils/options-and-events.js`):
  - Events are args starting with `on*` or `onceOn*` (e.g. `@onClick`, `@onceOnIdle`).
  - Event names are decamelized before binding (e.g. `onZoomChanged` → `zoom_changed`).
  - Options can be passed directly as args OR nested under `@options={{hash ...}}`.
  - Events can be nested under `@events={{hash ...}}`.
  - Ignored args: `lat`, `lng`, `getContext`.

## Build-time “magic” (important)
- `index.js` wires Htmlbars AST transforms that rewrite `addon/components/g-map.hbs`:
  - `lib/ast-transforms/treeshaker.js`: removes/rewrites yielded components based on `ember-google-maps.only/except` config.
  - `lib/ast-transforms/addon-factory.js`: injects “addons for this addon” + custom components into the yielded hash.
- If you change the yielded hash in `g-map.hbs`, check whether the treeshaker/addon-factory behavior also needs updating.

## Custom components
- Consumers can provide `ENV['ember-google-maps'].customComponents` (merged across addons via `lib/addons/custom-components.js`).
- Build tests exercise this pattern: see `build-tests/build-test.js`.

## Dev workflows (repo root)
- Install: `pnpm install`
- Run tests + lint: `pnpm test`
- Ember tests only: `pnpm test:ember`
- Compatibility matrix: `pnpm test:ember-compatibility` (ember-try)
- Build-time integration tests: `pnpm test:build`
  - Needs `GOOGLE_MAPS_API_KEY` or a `.env.test` file at repo root.

## Where to change code
- Make functional changes in `addon/` (the `app/` tree is mostly re-exports for consumers).
- Prefer updating/adding a concrete map component in `addon/components/g-map/` over adding logic to `GMap` unless it’s truly cross-cutting.
