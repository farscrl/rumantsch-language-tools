import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { Proofreader } from "../../src/proofreader";

const FIXTURES_DIR = path.join(__dirname, '../fixtures');

let server: http.Server;
let baseUrl: string;

beforeAll(async () => {
    server = http.createServer((req, res) => {
        const filePath = path.join(FIXTURES_DIR, req.url ?? '');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found');
            } else {
                res.writeHead(200);
                res.end(data);
            }
        });
    });

    await new Promise<void>((resolve) => server.listen(0, resolve));
    const address = server.address() as { port: number };
    baseUrl = `http://localhost:${address.port}`;
});

afterAll(async () => {
    await new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve()))
    );
});

test('basic spellchecking surmiran', async () => {
    const surmiran = await Proofreader.CreateProofreader('rm-surmiran', { baseUrl });

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

    // email
    expect(await surmiran.proofreadText('info@paginadasurmeir.ch')).toEqual([]);

    // soft hyphen, zero-width space
    expect(await surmiran.proofreadText('Text cor­rect')).toEqual([]);
    expect(await surmiran.proofreadText('Text cor​rect')).toEqual([]);

    expect(await surmiran.proofreadText('10 mails')).toEqual([{'length': 5, 'offset': 3, 'word': 'mails'}]);
    expect(await surmiran.proofreadText('1.5 mails')).toEqual([{'length': 5, 'offset': 4, 'word': 'mails'}]);
});

test('get suggestions surmiran', async () => {
    const surmiran = await Proofreader.CreateProofreader('rm-surmiran', { baseUrl });

    expect(await surmiran.getSuggestions('corect')).toEqual(['correct', 'rectorat', 'lectore', 'recorrer', 'recorr']);
});
