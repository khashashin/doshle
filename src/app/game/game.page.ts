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
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    this.fetchWords();
  }

  async ionViewWillEnter() {
    this.restoreDefaults();
    await this.generateWord();

    this.storageService.get('theme').then(theme => {
      if (theme) {
        this.selectTheme(theme);
      } else {
        this.selectTheme('coffe');
      }
    });

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

  removeLetter() {
    if (this.currentColumn > 0) {
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

    const guess = this.guesses[this.currentGuessRow].map(e => e.value).join('');

    if (
      this.currentGuessRow === 'rowSix' &&
      this.currentColumn === this.currentWord.term.length
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

  restart() {
    this.restoreDefaults();
    this.router.navigate(['home']).then(() => {
      this.router.navigate(['game']);
    });
  }
  // TODO: complete this method
  async shareResult() {
    // generate base64 image from canvas
    const width = 500;
    const height = 500;
    const bitmap = await this.generateBitmap(width, height);
  }

  // TODO: complete this method
  private async generateBitmap(width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#1e151d';
    ctx.fillRect(0, 0, width, height);
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
    this.enterWordInfo.nativeElement.classList.remove('hidden');
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
