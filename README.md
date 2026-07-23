# Rumantsch Language Tools

A collection of tools for working with the Rumantsch (Romansh) language, published as an npm package.

## Requirements

Node.js 18 or later (the `Proofreader` uses the global `fetch` API), or a modern browser. The package ships both CJS and ESM builds plus TypeScript types.

## Installation

```bash
pnpm add @farscrl/rumantsch-language-tools
```

## Features

- **Tokenizer** — splits text into individual tokens, handling Romansh-specific abbreviations and punctuation (based on [stdlib-js/nlp-tokenize](https://github.com/stdlib-js/nlp-tokenize/blob/main/lib/main.js))
- **Proofreader** — hunspell-based spellchecker supporting all Romansh idioms

### Supported idioms

| Code | Idiom |
|------|-------|
| `rm-puter` | Puter |
| `rm-rumgr` | Rumantsch Grischun |
| `rm-surmiran` | Surmiran |
| `rm-sursilv` | Sursilvan |
| `rm-sutsilv` | Sutsilvan |
| `rm-vallader` | Vallader |

These codes are exported as the `Idioms` type.

## Usage

### Tokenizer

```ts
import { Tokenizer } from "@farscrl/rumantsch-language-tools";

Tokenizer.tokenize('In test dal tokenizer.');
// ['In', 'test', 'dal', 'tokenizer']
```

`tokenize(text, keepPunctuation?, keepWhitespace?)` — both flags default to `false`:

```ts
Tokenizer.tokenize('In test, dal tokenizer.', true);
// ['In', 'test', ',', 'dal', 'tokenizer', '.']
```

### Proofreader

```ts
import { Proofreader } from '@farscrl/rumantsch-language-tools';

const proofreader = await Proofreader.CreateProofreader('rm-surmiran');

await proofreader.proofreadText('Text correct');
// [] — no errors

await proofreader.proofreadText('in');
// [{ word: 'in', offset: 0, length: 2 }]

await proofreader.getSuggestions('corect');
// ['correct', ...]
```

`CreateProofreader` fetches the idiom's `.aff`/`.dic` files, compiles a WebAssembly-backed Hunspell instance, and resolves once it's ready. It throws if the dictionary fails to load. Once resolved, `proofreader.isLoaded` is `true` and `proofreader.version` holds the dictionary's version string.

Dictionary files are fetched from `https://www.spellchecker.pledarigrond.ch` by default. To use a self-hosted mirror, pass a `baseUrl` option:

```ts
const proofreader = await Proofreader.CreateProofreader('rm-surmiran', {
  baseUrl: 'https://your-host.example.com'
});
```

Call `unload()` when you are done to free the dictionary from memory. The instance cannot be used afterwards:

```ts
proofreader.unload();
```

## Development

```bash
pnpm install      # install dependencies
pnpm test         # run tests
pnpm run build    # compile to lib/
pnpm run lint     # lint
```

### Publishing a new version

There is no CI publish pipeline — releases are cut locally.

1. On an up-to-date `main` with a clean working tree, make sure you're logged in to npm (`npm whoami`).
2. Bump the version, which lints (`preversion`), formats and stages `src/` (`version`), then commits, tags, and pushes both the commit and the tag (`postversion`):

   ```bash
   pnpm version patch   # or: minor / major
   ```
3. Publish to npm. `prepublishOnly` runs the full test suite and lint before publishing:

   ```bash
   pnpm publish
   ```

   If this is the first publish under a new scope, add `--access public`.
