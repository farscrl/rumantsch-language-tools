import { Proofreader } from "../../src/proofreader";

test('basic spellchecking surmiran', async () => {
    const surmiran = await Proofreader.CreateProofreader('rm-surmiran');

    expect(surmiran.version).not.toBe('');

    // correct
    expect(await surmiran.proofreadText('Text correct')).toEqual([]);
    expect(await surmiran.proofreadText('Chegl è en text surmiran correct. L\'evla sgola. Gl\'è aton. De per plascheir en\'ava all\'onda. D\'en de a l\'oter mantga en calzer dall\'oca. Chest\'onn vainsa vasia mintg\'auto. L\'om tg\'è curria da veia se ò durmia bagn.')).toEqual([]);
    expect(await surmiran.proofreadText('Ia va m\'infurmo bagn. Te ast t\'imagino ena massa merda. El è s\'avanzo spert. Els èn s\'avischinos all\'olma.')).toEqual([]);
    expect(await surmiran.proofreadText('Quant\'ava ast anc? Pac\'ava... Dovrast ple bler\'ava?')).toEqual([]);
    expect(await surmiran.proofreadText('Porta\'m chella roba! Porta\'l chella roba! Port\'la chella roba! Porta\'ns chella roba! Porta\'ls chella roba! Port\'las chella roba!')).toEqual([]);
    expect(await surmiran.proofreadText('Purte\'m chella roba! Purte\'l chella roba! Purte\'la chella roba! Purte\'ns chella roba! Purte\'ls chella roba! Purte\'las chella roba!')).toEqual([]);

    // errors
    expect(await surmiran.proofreadText('in')).toEqual([{'length': 2, 'offset': 0, 'word': 'in'}]);
    expect(await surmiran.proofreadText('sin')).toEqual([{'length': 3, 'offset': 0, 'word': 'sin'}]);

    // urls / email
    expect(await surmiran.proofreadText('https://www.paginadasurmeir.ch')).toEqual([]);
    expect(await surmiran.proofreadText('info@paginadasurmeir.ch')).toEqual([]);

    // soft hyphen, zero-width space
    expect(await surmiran.proofreadText('Text cor­rect')).toEqual([]);
    expect(await surmiran.proofreadText('Text cor​rect')).toEqual([]);

    expect(await surmiran.proofreadText('10 mails')).toEqual([{'length': 5, 'offset': 3, 'word': 'mails'}]);
    expect(await surmiran.proofreadText('1.5 mails')).toEqual([{'length': 5, 'offset': 4, 'word': 'mails'}]);
});

test('get suggestions surmiran', async () => {
    const surmiran = await Proofreader.CreateProofreader('rm-surmiran');

    expect(await surmiran.getSuggestions('corect')).toEqual(['correct', 'rectorat', 'recorrer', 'recorr', 'recor',]);
});
