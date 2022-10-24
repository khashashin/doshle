import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Haptics } from '@capacitor/haptics';
import { LogService } from '../services/log.service';
import { GameService } from '../services/game.service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  @ViewChild('noWordFound') noWordFound: ElementRef;
  @ViewChild('rowIsNotFull') rowIsNotFull: ElementRef;
  @ViewChild('hintOnlyTwice') hintOnlyTwice: ElementRef;
  @ViewChild('noHintForLastRow') noHintForLastRow: ElementRef;
  @ViewChild('noSettings') noSettings: ElementRef;
  @ViewChild('enterWordInfo') enterWordInfo: ElementRef;
  @ViewChild('congratulations') congratulations: ElementRef;
  @ViewChild('gameFailed') gameFailed: ElementRef;
  @ViewChild('closeGameModal') closeGameModal: ElementRef;
  @ViewChild('giveUpModal') giveUpModal: ElementRef;
  @ViewChild('noInfoToDisplayAlert') noInfoToDisplayAlert: ElementRef;
  @ViewChild('wordsTranslationModal') wordsTranslationModal: ElementRef;
  @ViewChild('shareImage') shareImage: ElementRef;
  @ViewChild('functionNotSupported') functionNotSupported: ElementRef;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  Object = Object;
  vibrationDuration = 10;

  keyboard = {
    firstRow: [
      {
        value: 'й',
        class: 'passive',
        disable: false,
      },
      {
        value: 'ц',
        class: 'passive',
        disable: false,
      },
      {
        value: 'у',
        class: 'passive',
        disable: false,
      },
      {
        value: 'к',
        class: 'passive',
        disable: false,
      },
      {
        value: 'е',
        class: 'passive',
        disable: false,
      },
      {
        value: 'н',
        class: 'passive',
        disable: false,
      },
      {
        value: 'г',
        class: 'passive',
        disable: false,
      },
      {
        value: 'ш',
        class: 'passive',
        disable: false,
      },
      {
        value: 'щ',
        class: 'passive',
        disable: false,
      },
    ],
    secondRow: [
      {
        value: 'з',
        class: 'passive',
        disable: false,
      },
      {
        value: 'х',
        class: 'passive',
        disable: false,
      },
      {
        value: 'Ӏ',
        class: 'passive',
        disable: false,
      },
      {
        value: 'ф',
        class: 'passive',
        disable: false,
      },
      {
        value: 'ы',
        class: 'passive',
        disable: false,
      },
      {
        value: 'в',
        class: 'passive',
        disable: false,
      },
      {
        value: 'а',
        class: 'passive',
        disable: false,
      },
      {
        value: 'п',
        class: 'passive',
        disable: false,
      },
      {
        value: 'р',
        class: 'passive',
        disable: false,
      },
    ],
    thirdRow: [
      {
        value: 'о',
        class: 'passive',
        disable: false,
      },
      {
        value: 'л',
        class: 'passive',
        disable: false,
      },
      {
        value: 'д',
        class: 'passive',
        disable: false,
      },
      {
        value: 'ж',
        class: 'passive',
        disable: false,
      },
      {
        value: 'э',
        class: 'passive',
        disable: false,
      },
      {
        value: 'ё',
        class: 'passive',
        disable: false,
      },
      {
        value: 'я',
        class: 'passive',
        disable: false,
      },
      {
        value: 'ч',
        class: 'passive',
        disable: false,
      },
      {
        value: 'с',
        class: 'passive',
        disable: false,
      },
    ],
    fourthRow: [
      {
        value: 'м',
        class: 'passive',
        disable: false,
      },
      {
        value: 'и',
        class: 'passive',
        disable: false,
      },
      {
        value: 'т',
        class: 'passive',
        disable: false,
      },
      {
        value: 'ь',
        class: 'passive',
        disable: false,
      },
      {
        value: 'ъ',
        class: 'passive',
        disable: false,
      },
      {
        value: 'б',
        class: 'passive',
        disable: false,
      },
      {
        value: 'ю',
        class: 'passive',
        disable: false,
      },
    ],
  };

  words = [];
  hintWords = [];
  guessWords = [];
  hintAndGuessWords = [];

  isGameFinished = false;

  wrongLetterClass = 'bg-gray-500';
  wrongPositionClass = 'bg-orange-500';
  correctLetterClass = 'bg-green-800';

  correctCellClass = 'bg-green-800 border-green-800';
  incorrectCellClass = 'bg-orange-500 border-orange-500';
  wrongCellClass = 'bg-gray-500 border-gray-500';

  guesses = {
    rowOne: [],
    rowTwo: [],
    rowThree: [],
    rowFour: [],
    rowFive: [],
    rowSix: [],
  };

  currentWord: any;
  currentWordIndex = null;
  currentGuessRow = 'rowOne';
  currentColumn = 0;

  isHelpUsed = 2;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private storageService: StorageService,
    private logService: LogService,
    private gameService: GameService,
    private socialSharing: SocialSharing,
    private platform: Platform
  ) {}

  async ngOnInit() {
    this.fetchWords();

    const theme = await this.storageService.get('theme');
    if (theme) {
      this.selectTheme(theme);
    } else {
      this.selectTheme('coffe');
    }
  }

  async ionViewWillEnter() {
    this.restoreDefaults();
    await this.generateWord();

    this.storageService.get('hint').then(hint => {
      if (hint) {
        this.enterWordInfo.nativeElement.classList.add('hidden');
      }
    });
  }

  selectTheme($e: any) {
    const theme = $e.target ? $e.target.value : $e;
    this.renderer.setAttribute(this.document.body, 'data-theme', theme);
    this.storageService.set('theme', theme);
  }

  async keyClicked(row, index) {
    this.enterWordInfo.nativeElement.classList.add('hidden');
    if (await this.isCurrentGuessRowFull()) {
      return;
    } else {
      try {
        await Haptics.vibrate({ duration: this.vibrationDuration });
      } catch (error) {
        this.logService.log(error);
      }
      this.guesses[this.currentGuessRow][this.currentColumn].value =
        row[index].value;
      this.currentColumn += 1;
    }
  }

  closeGame() {
    this.restoreDefaults();
    this.router.navigate(['/home']);
  }

  endGame() {
    this.congratulations.nativeElement.checked = false;
    this.gameFailed.nativeElement.checked = false;
    this.isGameFinished = true;
    for (const row in this.keyboard) {
      if (this.keyboard.hasOwnProperty(row)) {
        for (const key of this.keyboard[row]) {
          key.class = 'passive';
          key.disable = true;
        }
      }
    }
  }

  async removeLetter() {
    if (this.currentColumn > 0) {
      try {
        await Haptics.vibrate({ duration: this.vibrationDuration });
      } catch (error) {
        this.logService.log(error);
      }
      this.currentColumn -= 1;
      this.guesses[this.currentGuessRow][this.currentColumn].value = '';
    }
  }

  async checkWord() {
    if (!(await this.isCurrentGuessRowFull())) {
      this.toggleAlert(this.rowIsNotFull.nativeElement);
      return;
    }

    if (!(await this.isWordExists())) {
      this.toggleAlert(this.noWordFound.nativeElement);
      return;
    }

    try {
      await Haptics.vibrate({ duration: this.vibrationDuration });
    } catch (error) {
      this.logService.log(error);
    }
    const guess = this.guesses[this.currentGuessRow].map(e => e.value).join('');

    if (
      this.currentGuessRow === 'rowSix' &&
      this.currentColumn === this.currentWord.term.length &&
      guess !== this.currentWord.term
    ) {
      await this.completeGuessRow(guess);
      this.gameFailed.nativeElement.checked = true;
      return;
    }

    if (guess === this.currentWord.term) {
      await this.completeGuessRow(guess);
      this.congratulations.nativeElement.checked = true;
      this.currentGuessRow = 'rowOne';
      this.currentColumn = 0;
      return;
    } else {
      await this.completeGuessRow(guess);
    }

    this.currentGuessRow = this.getNextGuessRow();
    this.currentColumn = 0;
    this.guessWords.push(guess);
  }

  settingsClicked() {
    this.toggleAlert(this.noSettings.nativeElement);
    return;
  }

  async help() {
    if (this.isHelpUsed === 0) {
      this.toggleAlert(this.hintOnlyTwice.nativeElement);
      return;
    }

    if (this.currentGuessRow === 'rowSix') {
      this.toggleAlert(this.noHintForLastRow.nativeElement);
      return;
    }

    try {
      await Haptics.vibrate({ duration: this.vibrationDuration });
    } catch (error) {
      this.logService.log(error);
    }
    this.isHelpUsed -= 1;

    const hintWord = await this.getHintWord();

    if (hintWord) {
      for (const letter in hintWord) {
        if (hintWord.hasOwnProperty(letter)) {
          this.guesses[this.currentGuessRow][letter].value = hintWord[letter];
        }
      }
      await this.completeGuessRow(hintWord);
      this.currentGuessRow = this.getNextGuessRow();
      this.currentColumn = 0;
    }
  }

  closeHintToast() {
    this.enterWordInfo.nativeElement.classList.add('hidden');
    this.storageService.set('hint', true);
  }

  async giveUp() {
    for (const letter in this.currentWord.term) {
      if (this.currentWord.term.hasOwnProperty(letter)) {
        this.guesses[this.currentGuessRow][letter].value =
          this.currentWord.term[letter];
      }
    }
    await this.completeGuessRow(this.currentWord.term);
    this.currentGuessRow = this.getNextGuessRow();
    this.currentColumn = 0;
    this.giveUpModal.nativeElement.checked = false;
    this.isGameFinished = true;
    for (const row in this.keyboard) {
      if (this.keyboard.hasOwnProperty(row)) {
        for (const key of this.keyboard[row]) {
          key.class = 'passive';
          key.disable = true;
        }
      }
    }
  }

  async openGiveUpModal() {
    try {
      await Haptics.vibrate({ duration: this.vibrationDuration });
    } catch (error) {
      this.logService.log(error);
    }
    this.giveUpModal.nativeElement.checked = true;
  }

  restart() {
    this.restoreDefaults();
    this.router.navigate(['home']).then(() => {
      this.router.navigate(['game']);
    });
  }

  async openInfoModal() {
    if (this.guessWords.length === 0 && this.hintWords.length === 0) {
      this.toggleAlert(this.noInfoToDisplayAlert.nativeElement);
      return;
    }

    try {
      await Haptics.vibrate({ duration: this.vibrationDuration });
    } catch (error) {
      this.logService.log(error);
    }
    const db = await fetch('assets/data_transl.json').then(response =>
      response.json()
    );

    for (const word of this.guessWords) {
      for (const key in db) {
        if (db.hasOwnProperty(key)) {
          if (db[key].term === word) {
            this.hintAndGuessWords.push(db[key].translation);
            break;
          }
        }
      }
    }

    for (const word of this.hintWords) {
      for (const key in db) {
        if (db.hasOwnProperty(key)) {
          if (db[key].term === word) {
            this.hintAndGuessWords.push(db[key].translation);
            break;
          }
        }
      }
    }

    if (this.isGameFinished) {
      this.hintAndGuessWords.push(this.currentWord.translation);
    }

    this.wordsTranslationModal.nativeElement.checked = true;
  }

  getWordFromHintAndGuessWords(translation) {
    for (const key in translation) {
      if (translation.hasOwnProperty(key)) {
        return translation[key][0].word;
      }
    }
  }

  restoreDictionary() {
    if (this.wordsTranslationModal.nativeElement.checked) {
      return;
    } else {
      this.hintAndGuessWords = [];
    }
  }

  getDictionaryName(key) {
    switch (key) {
      case 'maciev_ce_ru':
        return '<nobr>Мациев А.Г.</nobr> <nobr>Чеченско-русский</nobr> словарь';
      case 'karasaev_maciev_ru_ce':
        return '<nobr>Карасаев А.Т.,</nobr> <nobr>Мациев А.Г.</nobr> <nobr>Русско-чеченский</nobr> словарь';
      case 'umarhadjiev_ahmatukaev_ce_ru_ru_ce':
        // eslint-disable-next-line max-len
        return '<nobr>Умархаджиев С.М.,</nobr> <nobr>Ахматукаев А.А.</nobr> <nobr>Чеченско-русский</nobr> <nobr>русско-чеченский</nobr> словарь математических терминов';
      case 'abdurashidov_ce_ru_ru_ce':
        return '<nobr>Абдурашидов Э.Д.</nobr> <nobr>Чеченско-русский</nobr> <nobr>русско-чеченский</nobr> словарь юридических терминов';
      case 'ce_ru_anatomy':
        return '<nobr>Берсанов Р.У.</nobr> <nobr>Чеченско-русский</nobr> словарь анатомии человека';
      case 'ru_ce_anatomy':
        return '<nobr>Берсанов Р.У.</nobr> <nobr>Русско-чеченский</nobr> словарь анатомии человека';
      case 'ru_ce_ce_ru_computer':
        // eslint-disable-next-line max-len
        return '<nobr>Умархаджиев С.М.,</nobr> <nobr>Асхабов Х.И.,</nobr> <nobr>Бадаева А.С.,</nobr> <nobr>Вагапов А.Д.,</nobr> <nobr>Израилова Э.С.,</nobr> <nobr>Султанов З.А.,</nobr> <nobr>Астемиров А.В.</nobr>  <nobr>Русско-чеченский</nobr> <nobr>чеченско-русский</nobr> словарь компьютерной лексики';
      case 'baisultanov_ce_ru':
        return '<nobr>Байсултанов Д.Б.</nobr> <nobr>Чеченско-русский</nobr> словарь';
      case 'ismailov_ce_ru':
        return '<nobr>Исмаилов А.</nobr> <nobr>Чеченско-русский</nobr> словарь';
      case 'ismailov_ru_ce':
        return '<nobr>Исмаилов А.</nobr> <nobr>Русско-чеченский</nobr> словарь';
      case 'aslahanov_ru_ce':
        return '<nobr>Аслаханов С-А.М.</nobr> <nobr>Русско-чеченский</nobr> словарь спортивных терминов и словосочетаний';
      default:
        return 'Неизвестный словарь';
    }
  }

  async shareResult() {
    const image = await this.gameService.getShareImageFromResult(
      this.shareImage.nativeElement,
      this.guesses
    );

    // create file from base64 string
    const blob = await (await fetch(image)).blob();
    const file = new File([blob], 'assets/fileName.png', { type: blob.type });

    if (
      this.platform.is('pwa') ||
      this.platform.is('mobileweb') ||
      this.platform.is('desktop')
    ) {
      navigator
        .share({
          title: 'Угадай чеченское слово',
          text: 'Попробуй разгадать слова из игры "Дошле"!',
          url: 'https://doshle.dosham.info',
          files: [file],
        })
        .catch(error => {
          this.toggleAlert(this.functionNotSupported.nativeElement);
          this.logService.log(error);
        });
    } else {
      const options = {
        message: 'Попробуй разгадать слова из игры "Дошле"!',
        subject: 'Угадай чеченское слово',
        files: [image],
        url: 'https://doshle.dosham.info',
      };
      this.socialSharing.shareWithOptions(options).catch(error => {
        this.toggleAlert(this.functionNotSupported.nativeElement);
        this.logService.log(error);
      });
    }
  }

  private async getHintWord() {
    const randomIndex = this.generateRandomNumber();
    const hintWord = this.words[randomIndex];
    if (
      hintWord === this.currentWord ||
      hintWord.length !== this.currentWord.term.length ||
      this.hintWords.includes(hintWord)
    ) {
      return this.getHintWord();
    }

    this.hintWords.push(hintWord);
    return hintWord;
  }

  private async restoreDefaults() {
    this.hintWords = [];
    this.guessWords = [];
    this.hintAndGuessWords = [];
    this.isGameFinished = false;
    this.currentWordIndex = null;
    this.isHelpUsed = 2;
    this.currentGuessRow = 'rowOne';
    this.currentColumn = 0;
    this.guesses = {
      rowOne: [],
      rowTwo: [],
      rowThree: [],
      rowFour: [],
      rowFive: [],
      rowSix: [],
    };

    for (const row in this.keyboard) {
      if (this.keyboard.hasOwnProperty(row)) {
        for (const key of this.keyboard[row]) {
          key.class = 'passive';
          key.disable = false;
        }
      }
    }
    this.closeGameModal.nativeElement.checked = false;
    this.congratulations.nativeElement.checked = false;
    this.gameFailed.nativeElement.checked = false;
    this.storageService.get('hint').then(hint => {
      if (hint) {
        this.enterWordInfo.nativeElement.classList.add('hidden');
      }
    });
  }

  private async completeGuessRow(guess) {
    // eslint-disable-next-line guard-for-in
    for (const letter in guess) {
      if (!this.currentWord.term.includes(guess[letter])) {
        const key = await this.getKeyByLetter(guess[letter]);
        key.class = this.wrongLetterClass;
        const cells = await this.getCellsByLetter(guess[letter]);
        cells.forEach(cell => {
          cell.className = this.wrongCellClass;
        });
      }

      if (guess[letter] === this.currentWord.term[letter]) {
        const key = await this.getKeyByLetter(guess[letter]);
        key.class = this.correctLetterClass;
        const cell = await this.getCellByIndex(letter);
        cell.className = this.correctCellClass;
      }

      if (
        guess[letter] !== this.currentWord.term[letter] &&
        this.currentWord.term.includes(guess[letter])
      ) {
        const key = await this.getKeyByLetter(guess[letter]);
        key.class = this.wrongPositionClass;
        const cell = await this.getCellByIndex(letter);
        cell.className = this.incorrectCellClass;
      }
    }
  }

  private async getCellByIndex(index) {
    return await this.guesses[this.currentGuessRow][index];
  }

  private async getCellsByLetter(letter) {
    const cells = [];
    for (const cell in this.guesses[this.currentGuessRow]) {
      if (this.guesses[this.currentGuessRow][cell].value === letter) {
        cells.push(this.guesses[this.currentGuessRow][cell]);
      }
    }

    return cells;
  }

  private async getKeyByLetter(letter) {
    for (const row in this.keyboard) {
      if (this.keyboard.hasOwnProperty(row)) {
        const key = this.keyboard[row].find(l => l.value === letter);
        if (key) {
          return key;
        }
      }
    }
  }

  private toggleAlert(element) {
    element.classList.add('flex');
    element.classList.remove('hidden');
    setTimeout(() => {
      element.classList.remove('flex');
      element.classList.add('hidden');
    }, 2400);
  }

  private async fetchWords() {
    const db = await fetch('assets/data_transl.json').then(response =>
      response.json()
    );

    // db is an object, so we need to loop through it and get terms
    for (const key in db) {
      if (db.hasOwnProperty(key)) {
        this.words.push(db[key].term);
      }
    }
  }

  private async isWordExists() {
    const guess = this.guesses[this.currentGuessRow].map(e => e.value).join('');
    const word = await this.getWord(guess);
    console.log(word);
    return word !== undefined;
  }

  private async getWord(guess) {
    return this.words.find(word => word === guess);
  }

  private getNextGuessRow() {
    switch (this.currentGuessRow) {
      case 'rowOne':
        return 'rowTwo';
      case 'rowTwo':
        return 'rowThree';
      case 'rowThree':
        return 'rowFour';
      case 'rowFour':
        return 'rowFive';
      case 'rowFive':
        return 'rowSix';
      case 'rowSix':
        return 'rowOne';
    }
  }

  private async isCurrentGuessRowFull() {
    let isFull = true;
    for (const element of this.guesses[this.currentGuessRow]) {
      if (element.value === '') {
        isFull = false;
        break;
      }
    }

    return isFull;
  }

  private async generateWord() {
    this.currentWordIndex = this.generateRandomNumber();
    await fetch('assets/data_transl.json').then(async response => {
      await response.json().then(data => {
        this.currentWord = data[this.currentWordIndex];
        for (const l of this.currentWord.term) {
          this.guesses.rowOne.push({
            value: '',
            className: 'passive',
          });
          this.guesses.rowTwo.push({
            value: '',
            className: 'passive',
          });
          this.guesses.rowThree.push({
            value: '',
            className: 'passive',
          });
          this.guesses.rowFour.push({
            value: '',
            className: 'passive',
          });
          this.guesses.rowFive.push({
            value: '',
            className: 'passive',
          });
          this.guesses.rowSix.push({
            value: '',
            className: 'passive',
          });
        }
      });
    });
  }

  private generateRandomNumber(min = 1, max = 1302) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
