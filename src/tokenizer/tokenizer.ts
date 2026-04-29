/**
 * This is a modified version of the Stdlib tokenizer, optimized for Romansh languages.
 * Original: https://github.com/stdlib-js/nlp-tokenize/blob/main/lib/main.js
 * Changes:
 *  - Replaced abbreviation list
 *  - removed concatenation list
 *  - extended prefix/suffix regex list
 *  - add ability to ignore punctuation
 *
 *
 * Original license:
 *
 * @license Apache-2.0
 *
 * Copyright (c) 2018 The Stdlib Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const REGEXP_PREFIXES = /^([,()[\]{}*<>«»„"”‟“'‘’`!?%/|:;\-–+…©#&]|\.{1,3})/gi;
const REGEXP_SUFFIXES = /([,()[\]{}*<>«»„"”‟“'‘’`!?%/|:;\-–+…©#&]|\.{1,3})$/gi;

const EMOJI_LIST = new Set([
  '^_^', '=D', ';-p', ':O', ':-/', ';(', '(:', '")',
  ':Y', ':]', ':3', ':(', ':-)', '=3', ':))', ':>',
  ';p', ':p', '=[[', '<333', '<33', ':P', 'o.O', '<3',
  ';-)', ':)', '-_-', ';)', '=]', '(=', '-__-', ':/',
  ':0', '(^_^)', ';D', ':((', '=)', 'xD', 'V_V', 'xDD',
  'o_O', 'o_o', ":')",
]);


const ABBREVIATION_LIST = new Set([
  'p.ex.', 'P.ex.',
  'sigr.', 'Sigr.',
  'dna.', 'Dna.',
  'ca.', 'Ca.',
  'za.', 'Za.',
  'etc.', 'Etc.',
  'resp.', 'Resp.',
  'ev.', 'Ev.',
  't.a.', 'T.a.',
  'd.a.', 'D.a.',
  't.o.', 'T.o.',
  'q.v.d.', 'Q.v.d.',
  'q.v.g.', 'Q.v.g.',
  'c.v.d.', 'C.v.d.',
  'qvd.', 'Qvd.',
  'qvg.', 'Qvg.',
  'cvd.', 'Cvd.',
  'e.u.v.', 'E.u.v.',
  'e.a.v.', 'E.a.v.',
  'a.a.a.', 'A.a.a.',
  'e.u.a.', 'E.u.a.',
  'e.u.i.', 'E.u.i.',
  'euv.', 'Euv.',
  'eav.', 'Eav.',
  'aaa.', 'Aaa.',
  'eua.', 'Eua.',
  'eui.', 'Eui.',
  'e.o.pl.', 'E.o.pl.',
  'e.o.p.', 'E.o.p.',
  'eopl.', 'Eopl.',
  'eop.', 'Eop.',
  'rum.', 'Rum.',
  'rom.', 'Rom.',
  'tud.', 'Tud.',
  'tal.', 'Tal.',
  'fr.', 'Fr.',
  'engl.', 'Engl.',
  'angl.', 'Angl.',
  'ingl.', 'Ingl.',
  'lat.', 'Lat.',
  'spagn.', 'Spagn.',
  'port.', 'Port.',
  'surs.', 'Surs.',
  'suts.', 'Suts.',
  'surm.', 'Surm.',
  'put.', 'Put.',
  'vall.', 'Vall.',
  'lad.', 'Lad.',
  'p.', 'P.',
  'al.', 'Al.',
  'v.', 'V.',
  'vol.', 'Vol.',
  'cf.', 'Cf.',
  'a.Cr.', 'A.Cr.',
  's.Cr.', 'S.Cr.',
  'd.Cr.', 'D.Cr.',
  'z.Cr.', 'Z.Cr.',
  's.', 'S.',
  'ss.', 'Ss.',
  'km/h', 'm/s',
  'm s.m.', 'nr.',
  'Nr.', 'dr.',
  'Dr.', 'prof.',
  'Prof.', 'em.',
  'Em.', 'excl.',
  'Excl.', 'incl.',
  'Incl.', 'do.',
  'Do.', 'p.pl.',
  'P.pl.', 'chf',
  'CHF', 'frs.',
  'Frs.', 'rp.',
  'Rp.', 'rps.',
  'Rps.',
]);


function tokenize(stringToTokenize: string, keepPunctuation = false, keepWhitespace = false): string[] {
  let subWords: string[];
  let words: string[];
  const tokens: string[] = [];

  if (!stringToTokenize) {
    return [];
  }

  if (keepWhitespace) {
    words = stringToTokenize.split(/(\s+)|(\/)/);
  } else {
    words = stringToTokenize.split(/\s+|\//);
  }

  for (const wrd of words) {
    subWords = tokenizeSubstring(wrd, keepPunctuation);
    tokens.push(...subWords);
  }
  return tokens;
}

function tokenizeSubstring(substring: string, keepPunctuation = false): string[] {
  const prefixes: string[] = [];
  const suffixes: string[] = [];
  let match;
  let done = false;
  let result: string[] = [];

  do {
    if (!EMOJI_LIST.has(substring) && !ABBREVIATION_LIST.has(substring)) {
      match = substring.split(REGEXP_PREFIXES);
      if (match.length > 1) {
        prefixes.push(match[1]);
        substring = match[2];
      } else {
        match = substring.split(REGEXP_SUFFIXES);
        if (match.length > 1) {
          substring = match[0];
          suffixes.unshift(match[1]);
        } else {
          done = true;
        }
      }
    } else {
      done = true;
    }
  } while (!done);

  if (keepPunctuation) {
    result = prefixes;
  }

  if (substring) {
    result.push(substring);
  }

  if (keepPunctuation) {
    result.push(...suffixes);
  }
  return result;
}


export { tokenize };
