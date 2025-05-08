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

/*eslint @typescript-eslint/no-explicit-any: ["error", { "ignoreRestArgs": true }]*/

const REGEXP_PREFIXES = /^([,()[\]{}*<>«»„"”‟“'‘’`!?%/|:;\-–+…©#&]|\.{1,3})/gi;
const REGEXP_SUFFIXES = /([,()[\]{}*<>«»„"”‟“'‘’`!?%/|:;\-–+…©#&]|\.{1,3})$/gi;

/* eslint-disable @typescript-eslint/no-explicit-any */
const EMOJI_LIST: any = {
  '^_^': ['^_^'],
  '=D': ['=D'],
  ';-p': [';-p'],
  ':O': [':O'],
  ':-/': [':-/'],
  xD: ['xD'],
  V_V: ['V_V'],
  ';(': [';('],
  '(:': ['(:'],
  '")': ['")'],
  ':Y': [':Y'],
  ':]': [':]'],
  ':3': [':3'],
  ':(': [':('],
  ':-)': [':-)'],
  '=3': ['=3'],
  ':))': [':))'],
  ':>': [':>'],
  ';p': [';p'],
  ':p': [':p'],
  '=[[': ['=[['],
  xDD: ['xDD'],
  '<333': ['<333'],
  '<33': ['<33'],
  ':P': [':P'],
  'o.O': ['o.O'],
  '<3': ['<3'],
  ';-)': [';-)'],
  ':)': [':)'],
  '-_-': ['-_-'],
  ":')": [":')"],
  o_O: ['o_O'],
  ';)': [';)'],
  '=]': ['=]'],
  '(=': ['(='],
  '-__-': ['-__-'],
  ':/': [':/'],
  ':0': [':0'],
  '(^_^)': ['(^_^)'],
  ';D': [';D'],
  o_o: ['o_o'],
  ':((': [':(('],
  '=)': ['=)'],
};

const ABBREVIATION_LIST: any = {
  'p.ex.': ['p.ex.'],
  'P.ex.': ['P.ex.'],

  'sigr.': ['sigr.'],
  'Sigr.': ['Sigr.'],

  'dna.': ['dna.'],
  'Dna.': ['Dna.'],

  'ca.': ['ca.'],
  'Ca.': ['Ca.'],

  'za.': ['za.'],
  'Za.': ['Za.'],

  'etc.': ['etc.'],
  'Etc.': ['Etc.'],

  'resp.': ['resp.'],
  'Resp.': ['Resp.'],

  'ev.': ['ev.'],
  'Ev.': ['Ev.'],

  't.a.': ['t.a.'],
  'T.a.': ['T.a.'],

  'd.a.': ['d.a.'],
  'D.a.': ['D.a.'],

  't.o.': ['t.o.'],
  'T.o.': ['T.o.'],

  'q.v.d.': ['q.v.d.'],
  'Q.v.d.': ['Q.v.d.'],

  'q.v.g.': ['q.v.g.'],
  'Q.v.g.': ['Q.v.g.'],

  'c.v.d.': ['c.v.d.'],
  'C.v.d.': ['C.v.d.'],

  'qvd.': ['qvd.'],
  'Qvd.': ['Qvd.'],

  'qvg.': ['qvg.'],
  'Qvg.': ['Qvg.'],

  'cvd.': ['cvd.'],
  'Cvd.': ['Cvd.'],

  'e.u.v.': ['e.u.v.'],
  'E.u.v.': ['E.u.v.'],

  'e.a.v.': ['e.a.v.'],
  'E.a.v.': ['E.a.v.'],

  'a.a.a.': ['a.a.a.'],
  'A.a.a.': ['A.a.a.'],

  'e.u.a.': ['e.u.a.'],
  'E.u.a.': ['E.u.a.'],

  'e.u.i.': ['e.u.i.'],
  'E.u.i.': ['E.u.i.'],

  'euv.': ['euv.'],
  'Euv.': ['Euv.'],

  'eav.': ['eav.'],
  'Eav.': ['Eav.'],

  'aaa.': ['aaa.'],
  'Aaa.': ['Aaa.'],

  'eua.': ['eua.'],
  'Eua.': ['Eua.'],

  'eui.': ['eui.'],
  'Eui.': ['Eui.'],

  'e.o.pl.': ['e.o.pl.'],
  'E.o.pl.': ['E.o.pl.'],

  'e.o.p.': ['e.o.p.'],
  'E.o.p.': ['E.o.p.'],

  'eopl.': ['eopl.'],
  'Eopl.': ['Eopl.'],

  'eop.': ['eop.'],
  'Eop.': ['Eop.'],

  'rum.': ['rum.'],
  'Rum.': ['Rum.'],

  'rom.': ['rom.'],
  'Rom.': ['Rom.'],

  'tud.': ['tud.'],
  'Tud.': ['Tud.'],

  'tal.': ['tal.'],
  'Tal.': ['Tal.'],

  'fr.': ['fr.'],
  'Fr.': ['Fr.'],

  'engl.': ['engl.'],
  'Engl.': ['Engl.'],

  'angl.': ['angl.'],
  'Angl.': ['Angl.'],

  'ingl.': ['ingl.'],
  'Ingl.': ['Ingl.'],

  'lat.': ['lat.'],
  'Lat.': ['Lat.'],

  'spagn.': ['spagn.'],
  'Spagn.': ['Spagn.'],

  'port.': ['port.'],
  'Port.': ['Port.'],

  'surs.': ['surs.'],
  'Surs.': ['Surs.'],

  'suts.': ['suts.'],
  'Suts.': ['Suts.'],

  'surm.': ['surm.'],
  'Surm.': ['Surm.'],

  'put.': ['put.'],
  'Put.': ['Put.'],

  'vall.': ['vall.'],
  'Vall.': ['Vall.'],

  'lad.': ['lad.'],
  'Lad.': ['Lad.'],

  'p.': ['p.'],
  'P.': ['P.'],

  'al.': ['al.'],
  'Al.': ['Al.'],

  'v.': ['v.'],
  'V.': ['V.'],

  'vol.': ['vol.'],
  'Vol.': ['Vol.'],

  'cf.': ['cf.'],
  'Cf.': ['Cf.'],

  'a.Cr.': ['a.Cr.'],
  'A.Cr.': ['A.Cr.'],

  's.Cr.': ['s.Cr.'],
  'S.Cr.': ['S.Cr.'],

  'd.Cr.': ['d.Cr.'],
  'D.Cr.': ['D.Cr.'],

  'z.Cr.': ['z.Cr.'],
  'Z.Cr.': ['Z.Cr.'],

  's.': ['s.'],
  'S.': ['S.'],

  'ss.': ['ss.'],
  'Ss.': ['Ss.'],

  'km/h': ['km/h'],

  'm/s': ['m/s'],

  'm s.m.': ['m s.m.'],

  'nr.': ['nr.'],
  'Nr.': ['Nr.'],

  'dr.': ['dr.'],
  'Dr.': ['Dr.'],

  'prof.': ['prof.'],
  'Prof.': ['Prof.'],

  'em.': ['em.'],
  'Em.': ['Em.'],

  'excl.': ['excl.'],
  'Excl.': ['Excl.'],

  'incl.': ['incl.'],
  'Incl.': ['Incl.'],

  'do.': ['do.'],
  'Do.': ['Do.'],

  'p.pl.': ['p.pl.'],
  'P.pl.': ['P.pl.'],

  'chf': ['chf'],
  'CHF': ['CHF'],

  // 'fr.': ['fr.'], // equal to franzos
  // 'Fr.': ['Fr.'],

  'frs.': ['frs.'],
  'Frs.': ['Frs.'],

  'rp.': ['rp.'],
  'Rp.': ['Rp.'],

  'rps.': ['rps.'],
  'Rps.': ['Rps.'],
};
/* eslint-enable @typescript-eslint/no-explicit-any */

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
    extendArray(tokens, subWords);
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
    if (!EMOJI_LIST[substring] && !ABBREVIATION_LIST[substring]) {
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
    extendArray(result, suffixes);
  }
  return result;
}

function extendArray(baseArray: string[], extension: string[]): string[] {
  for (const ext of extension) {
    baseArray.push(ext);
  }
  return baseArray;
}

export { tokenize };
