# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 1.1.3 - 2026-11-03

### Fixed

- `Tokenizer.tokenize()` no longer throws a `TypeError` when called with `keepWhitespace = true`
  (broken since 1.0.1).
- `Proofreader.unload()` now disposes the Hunspell instance and marks the proofreader as unloaded,
  so `proofreadText()` and `getSuggestions()` throw as documented when called afterwards.

## 1.1.2 - 2026-08-19

### Fixed

- `Idioms` and `ITextWithPosition` are now exported as flat type exports from the package root
  (`import type { Idioms, ITextWithPosition } from '@farscrl/rumantsch-language-tools'`).
  They are no longer re-exported under the `Proofreader` namespace as in 1.1.1.
- Bumped `@farscrl/hunspell-wasm` to 1.0.1, fixing `node:` scheme resolution errors when bundling with webpack.

### Changed

- Updated `eslint` and `typescript-eslint` dev dependencies.

## 1.1.1 - 2026-08-19

### Fixed

- Re-exported the `Idioms` and `ITextWithPosition` types from the `Proofreader` namespace (#1).
- Removed a stale `src/**/*.js` glob from the `format` script that broke `pnpm version`.

## 1.1.0 - 2026-07-23

### Changed

- Replaced `hunspell-asm` with `@farscrl/hunspell-wasm` as the spellchecking engine.
- Updated dependencies.
- Updated README.

## 1.0.5 - 2026-04-29

### Added

- `Proofreader.CreateProofreader()` accepts an optional `ProofreaderOptions` object; `baseUrl`
  configures where dictionaries are loaded from (defaults to `https://www.spellchecker.pledarigrond.ch`).
- The package now ships dual CJS/ESM builds (via tsup) with an `exports` map.

### Changed

- Compilation target raised from ES5 to ES2017.
- `containsElementToIgnore()` on `Proofreader` is now private.
- Internal cleanup: removed redundant wrappers and simplified lookup structures.
- Tooling: migrated from TSLint to ESLint and from npm to pnpm; updated dev dependencies.
- Tests now use local dictionary fixtures instead of the remote endpoint.

### Fixed

- `proofreadText()` and `getSuggestions()` throw a descriptive error when called before the
  dictionary is loaded or after `unload()`.
- Dictionary loading failures are rethrown with the idiom name in the error message.
- Renamed misspelled test folder and corrected the README.

## 1.0.4 - 2025-05-08

### Added

- Many additional Romansh abbreviations recognised by the tokenizer (e.g. `sigr.`, `dna.`, `ca.`,
  `etc.`, `resp.`, `ev.`, `t.a.`, `q.v.d.`, `c.v.d.`, …).

### Fixed

- Surmiran proofreader test.

### Changed

- Updated dependencies.

## 1.0.3 - 2025-02-18

### Changed

- Updated dependencies.
- Updated README.

## 1.0.2 - 2024-03-01

### Changed

- Updated dependencies (jest, TypeScript, prettier and others).

## 1.0.1 - 2023-07-10

### Changed

- The tokenizer now also splits tokens at the `/` character.

### Removed

- URL detection in the proofreader's ignore filter, since URLs are now split at `/` by the tokenizer.

## 1.0.0 - 2023-06-20

### Added

- Initial release with a tokenizer and a Hunspell-based proofreader for the Romansh idioms.
