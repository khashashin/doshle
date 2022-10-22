/* eslint-disable @typescript-eslint/naming-convention */
interface ITranslation {
  id: string;
  word: string;
  word1?: string;
  word2?: string;
  word3?: string;
  word4?: string;

  translate: string;
}

interface ITranslations {
  maciev_ce_ru?: ITranslation[];
  karasaev_maciev_ru_ce?: ITranslation[];
  umarhadjiev_ahmatukaev_ce_ru_ru_ce?: ITranslation[];
  abdurashidov_ce_ru_ru_ce?: ITranslation[];
  ce_ru_anatomy?: ITranslation[];
  ru_ce_anatomy?: ITranslation[];
  ru_ce_ce_ru_computer?: ITranslation[];
  baisultanov_ce_ru?: ITranslation[];
  ismailov_ce_ru?: ITranslation[];
  ismailov_ru_ce?: ITranslation[];
  aslahanov_ru_ce?: ITranslation[];
}

interface IWordTranslation {
  term: string;
  translation: ITranslation;
}

interface IRow {
  value: string;
  className: string;
}

interface IGuesses {
  rowOne: IRow[];
  rowTwo: IRow[];
  rowThree: IRow[];
  rowFour: IRow[];
  rowFive: IRow[];
  rowSix: IRow[];
}

export class Game {
  hintWords: string[];
  guessWords: string[];
  hintAndGuessWords: ITranslation[];

  isGameFinished: boolean;

  currentWord: IWordTranslation;
  currentWordIndex: number;
  currentGuessRow: string;
  currentColumn: number;

  isHelpUsed: number;

  guesses: IGuesses;

  constructor() {
    this.hintWords = [];
    this.guessWords = [];
    this.hintAndGuessWords = [];

    this.isGameFinished = false;

    this.currentWord = null;
    this.currentWordIndex = null;
    this.currentGuessRow = 'rowOne';
    this.currentColumn = 0;

    this.isHelpUsed = 2;

    this.guesses = {
      rowOne: [],
      rowTwo: [],
      rowThree: [],
      rowFour: [],
      rowFive: [],
      rowSix: [],
    };
  }
}
