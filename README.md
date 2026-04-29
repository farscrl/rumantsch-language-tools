# Rumantsch Language Tools

A collection of tools for working with the Rumantsch (Romansh) language, published as an npm package.

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

## Usage

### Tokenizer

```ts
import { Tokenizer } from "@farscrl/rumantsch-language-tools";

Tokenizer.tokenize('In test dal tokenizer.');
// ['In', 'test', 'dal', 'tokenizer']
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

Dictionary files are fetched from `https://www.spellchecker.pledarigrond.ch` by default. To use a self-hosted mirror, pass a `baseUrl` option:

```ts
const proofreader = await Proofreader.CreateProofreader('rm-surmiran', {
  baseUrl: 'https://your-host.example.com'
});
```

Call `unload()` when you are done to free the dictionary from memory:

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
