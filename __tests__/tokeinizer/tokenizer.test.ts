import { tokenize } from "../../src/tokenizer";

test('basic tokenizer', () => {
    expect(tokenize('In test dal tokenizer.'))
        .toStrictEqual(['In', 'test', 'dal', 'tokenizer']);
});

test('extract abbreviations', () => {
    expect(tokenize('Am gida p.pl.!'))
        .toStrictEqual(['Am', 'gida', 'p.pl.']);

    expect(tokenize('P.pl. ma gidar!'))
        .toStrictEqual(['P.pl.', 'ma', 'gidar']);

    expect(tokenize('P.ex. in pled.'))
        .toStrictEqual(['P.ex.', 'in', 'pled']);

    expect(tokenize('U  p.ex. ina chaussa.'))
        .toStrictEqual(['U', 'p.ex.', 'ina', 'chaussa']);

    expect(tokenize('In, dus, trais e.u.v.'))
        .toStrictEqual(['In', 'dus', 'trais', 'e.u.v.']);

    expect(tokenize('E.u.v. va quai'))
        .toStrictEqual(['E.u.v.', 'va', 'quai']);
});

test('strip special characters at the beginning', () => {
    expect(tokenize(',test')).toStrictEqual(['test']);
    expect(tokenize('(test')).toStrictEqual(['test']);
    expect(tokenize(')test')).toStrictEqual(['test']);
    expect(tokenize('[test')).toStrictEqual(['test']);
    expect(tokenize(']test')).toStrictEqual(['test']);
    expect(tokenize('{test')).toStrictEqual(['test']);
    expect(tokenize('}test')).toStrictEqual(['test']);
    expect(tokenize('*test')).toStrictEqual(['test']);
    expect(tokenize('<test')).toStrictEqual(['test']);
    expect(tokenize('>test')).toStrictEqual(['test']);
    expect(tokenize('«test')).toStrictEqual(['test']);
    expect(tokenize('»test')).toStrictEqual(['test']);
    expect(tokenize('„test')).toStrictEqual(['test']);
    expect(tokenize('"test')).toStrictEqual(['test']);
    expect(tokenize('”test')).toStrictEqual(['test']);
    expect(tokenize('‟test')).toStrictEqual(['test']);
    expect(tokenize('“test')).toStrictEqual(['test']);
    expect(tokenize('\'test')).toStrictEqual(['test']);
    expect(tokenize('‘test')).toStrictEqual(['test']);
    expect(tokenize('’test')).toStrictEqual(['test']);
    expect(tokenize('`test')).toStrictEqual(['test']);
    expect(tokenize('!test')).toStrictEqual(['test']);
    expect(tokenize('?test')).toStrictEqual(['test']);
    expect(tokenize('%test')).toStrictEqual(['test']);
    expect(tokenize('/test')).toStrictEqual(['test']);
    expect(tokenize('|test')).toStrictEqual(['test']);
    expect(tokenize(':test')).toStrictEqual(['test']);
    expect(tokenize(';test')).toStrictEqual(['test']);
    expect(tokenize('-test')).toStrictEqual(['test']);
    expect(tokenize('–test')).toStrictEqual(['test']);
    expect(tokenize('+test')).toStrictEqual(['test']);
    expect(tokenize('…test')).toStrictEqual(['test']);
    expect(tokenize('©test')).toStrictEqual(['test']);
    expect(tokenize('#test')).toStrictEqual(['test']);
    expect(tokenize('&test')).toStrictEqual(['test']);
    expect(tokenize('.test')).toStrictEqual(['test']);
    expect(tokenize('..test')).toStrictEqual(['test']);
    expect(tokenize('...test')).toStrictEqual(['test']);
});

test('strip special characters at the end', () => {
    expect(tokenize('test,')).toStrictEqual(['test']);
    expect(tokenize('test(')).toStrictEqual(['test']);
    expect(tokenize('test)')).toStrictEqual(['test']);
    expect(tokenize('test[')).toStrictEqual(['test']);
    expect(tokenize('test]')).toStrictEqual(['test']);
    expect(tokenize('test{')).toStrictEqual(['test']);
    expect(tokenize('test}')).toStrictEqual(['test']);
    expect(tokenize('test*')).toStrictEqual(['test']);
    expect(tokenize('test<')).toStrictEqual(['test']);
    expect(tokenize('test>')).toStrictEqual(['test']);
    expect(tokenize('test«')).toStrictEqual(['test']);
    expect(tokenize('test»')).toStrictEqual(['test']);
    expect(tokenize('test„')).toStrictEqual(['test']);
    expect(tokenize('test"')).toStrictEqual(['test']);
    expect(tokenize('test”')).toStrictEqual(['test']);
    expect(tokenize('test‟')).toStrictEqual(['test']);
    expect(tokenize('test“')).toStrictEqual(['test']);
    expect(tokenize('test\'')).toStrictEqual(['test']);
    expect(tokenize('test‘')).toStrictEqual(['test']);
    expect(tokenize('test’')).toStrictEqual(['test']);
    expect(tokenize('test`')).toStrictEqual(['test']);
    expect(tokenize('test!')).toStrictEqual(['test']);
    expect(tokenize('test?')).toStrictEqual(['test']);
    expect(tokenize('test%')).toStrictEqual(['test']);
    expect(tokenize('test/')).toStrictEqual(['test']);
    expect(tokenize('test|')).toStrictEqual(['test']);
    expect(tokenize('test:')).toStrictEqual(['test']);
    expect(tokenize('test;')).toStrictEqual(['test']);
    expect(tokenize('test-')).toStrictEqual(['test']);
    expect(tokenize('test–')).toStrictEqual(['test']);
    expect(tokenize('test+')).toStrictEqual(['test']);
    expect(tokenize('test…')).toStrictEqual(['test']);
    expect(tokenize('test©')).toStrictEqual(['test']);
    expect(tokenize('test#')).toStrictEqual(['test']);
    expect(tokenize('test&')).toStrictEqual(['test']);
    expect(tokenize('test.')).toStrictEqual(['test']);
    expect(tokenize('test..')).toStrictEqual(['test']);
    expect(tokenize('test...')).toStrictEqual(['test']);
});

test('strip multiple special characters at the beginning and end', () => {
    expect(tokenize('!.%&/test#,/%*,')).toStrictEqual(['test']);
});
