# Rumantsch language tools

Welcome to the Rumantsch Language Tools repository! This collection of tools is designed to aid in working with the Rumantsch (Romansh) language. Currently, it includes:

* Tokenizer: A tool for breaking down text into individual tokens (based on [stdlib-js/nlp-tokenize]( https://github.com/stdlib-js/nlp-tokenize/blob/main/lib/main.js))
* Spellchecking: Utilizing hunspell for accurate and correct spelling. Currently, it supports all idioms and Rumantsch Grischun (except `rm-sursilv`, coming soon). The dictionary files are loaded from an [external host](https://www.spellchecker.pledarigrond.ch).

Feel free to explore and utilize these tools for your Rumantsch language-related projects.
Happy linguistic exploration!

## Usage
### Tokenizer

    import { Tokenizer } from "@farscrl/rumantsch-language-tools";
    Tokenizer.tokenize('In test dal tokenizer.')

### Proofreader

    import { Proofreader } from '@farscrl/rumantsch-language-tools';
    const surmiran = await Proofreader.CreateProofreader('rm-surmiran');
    await surmiran.proofreadText('Text correct'); // returns []
    await surmiran.proofreadText('in'); // returns [{'length': 2, 'offset': 0, 'word': 'in'}]

## Tests
Tests are based on vitest. To execute them, run `npm test`.
