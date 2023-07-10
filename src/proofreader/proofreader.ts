import { Hunspell, HunspellFactory, loadModule } from 'hunspell-asm';
import { Idioms } from '../models/idioms';
import { ITextWithPosition } from '../models/data-structures';
import { Tokenizer } from '../index';

const baseUrl = 'https://www.spellchecker.pledarigrond.ch';

export class Proofreader {
  isLoaded = false;
  version = '';

  private idiom: Idioms;
  private hunspellFactory?: HunspellFactory;
  private affFile?: string;
  private dictFile?: string;
  private hunspell?: Hunspell;

  public static CreateProofreader = async (idiom: Idioms) => {
    const instance = new Proofreader(idiom);
    await instance.setup();
    instance.isLoaded = true;
    return instance;
  };

  // constructor is private, use the `CreateProofreader` static function instead to instantiate a proofreader.
  private constructor(idiom: Idioms) {
    this.idiom = idiom;
  }

  proofreadText(sentence: string): Promise<ITextWithPosition[]> {
    const tokens = this.tokenizeString(sentence);
    const errors: ITextWithPosition[] = [];

    tokens.forEach((tkn) => {
      if (!this.hunspell!.spell(this.removeSpecialChars(tkn.word))) {
        errors.push(tkn);
      }
    });

    return Promise.resolve(errors);
  }

  getSuggestions(word: string): Promise<string[]> {
    return Promise.resolve(this.hunspell!.suggest(this.removeSpecialChars(word)));
  }

  unload(): void {
    if (this.affFile) {
      this.hunspellFactory?.unmount(this.affFile);
    }
    if (this.dictFile) {
      this.hunspellFactory?.unmount(this.dictFile);
    }
  }

  private async setup(): Promise<void> {
    return await this.loadDictionary(this.idiom);
  }

  private async loadDictionary(langCode: Idioms) {
    this.hunspellFactory = await loadModule();

    const aff = await fetch(`${baseUrl}/hunspell/${langCode}/${langCode}.aff`);
    const affBuffer = new Uint8Array(await aff.arrayBuffer());
    this.affFile = this.hunspellFactory.mountBuffer(affBuffer, `${langCode}.aff`);

    const dic = await fetch(`${baseUrl}/hunspell/${langCode}/${langCode}.dic`);
    const dicBuffer = new Uint8Array(await dic.arrayBuffer());
    this.dictFile = this.hunspellFactory.mountBuffer(dicBuffer, `${langCode}.dic`);

    this.hunspell = this.hunspellFactory.create(this.affFile, this.dictFile);
    await this.onDictLoaded(langCode);
  }

  private async onDictLoaded(langCode: string) {
    await this.loadVersion(langCode);
    // console.log('loading spellchecker finished: ' + langCode);
  }

  private async loadVersion(langCode: string) {
    const version = await fetch(`${baseUrl}/hunspell/${langCode}/${langCode}_version.txt`);
    this.version = await version.text();
  }

  private tokenizeString(text: string): ITextWithPosition[] {
    const tkns = Tokenizer.tokenize(text, false, false) as string[];
    const tokens: ITextWithPosition[] = [];

    let trimmedOffset = 0;

    tkns.forEach((tkn) => {
      if (this.isNumeric(tkn)) {
        return;
      }

      if (this.containsElementToIgnore(tkn)) {
        return;
      }

      const index = text.indexOf(tkn, trimmedOffset);
      tokens.push({
        offset: index,
        length: tkn.length,
        word: tkn,
      });
      trimmedOffset = index + tkn.length;
    });

    return tokens;
  }

  private isNumeric(str: string | undefined) {
    return !isNaN(Number(str));
  }

  private removeSpecialChars(text: string): string {
    // remove soft hyphen, zero-width space, thin space
    return text.replace(/[\u00AD\u200B\u2009]+/g, '');
  }

  public containsElementToIgnore(text: string): boolean {
    // check if email
    if (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(
        text,
      )
    ) {
      return true;
    }

    return false;
  }
}
