import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  @ViewChild('noWordFound') noWordFound: ElementRef;
  @ViewChild('rowIsNotFull') rowIsNotFull: ElementRef;
  @ViewChild('hintOnlyOnce') hintOnlyOnce: ElementRef;
  @ViewChild('noHintForLastRow') noHintForLastRow: ElementRef;
  @ViewChild('noSettings')
  noSettings: ElementRef;
  @ViewChild('enterWordInfo') enterWordInfo: ElementRef;
  @ViewChild('congratulations')
  congratulations: ElementRef;
  @ViewChild('gameFailed') gameFailed: ElementRef;
  @ViewChild('closeGame')
  closeGame: ElementRef;
  keyboard = {
    firstRow: [
      {
        value: 'й',
        class: 'passive',
      },
      {
        value: 'ц',
        class: 'passive',
      },
      {
        value: 'у',
        class: 'passive',
      },
      {
        value: 'к',
        class: 'passive',
      },
      {
        value: 'е',
        class: 'passive',
      },
      {
        value: 'н',
        class: 'passive',
      },
      {
        value: 'г',
        class: 'passive',
      },
      {
        value: 'ш',
        class: 'passive',
      },
      {
        value: 'щ',
        class: 'passive',
      },
    ],
    secondRow: [
      {
        value: 'з',
        class: 'passive',
      },
      {
        value: 'х',
        class: 'passive',
      },
      {
        value: 'Ӏ',
        class: 'passive',
      },
      {
        value: 'ф',
        class: 'passive',
      },
      {
        value: 'ы',
        class: 'passive',
      },
      {
        value: 'в',
        class: 'passive',
      },
      {
        value: 'а',
        class: 'passive',
      },
      {
        value: 'п',
        class: 'passive',
      },
      {
        value: 'р',
        class: 'passive',
      },
    ],
    thirdRow: [
      {
        value: 'о',
        class: 'passive',
      },
      {
        value: 'л',
        class: 'passive',
      },
      {
        value: 'д',
        class: 'passive',
      },
      {
        value: 'ж',
        class: 'passive',
      },
      {
        value: 'э',
        class: 'passive',
      },
      {
        value: 'ё',
        class: 'passive',
      },
      {
        value: 'я',
        class: 'passive',
      },
      {
        value: 'ч',
        class: 'passive',
      },
      {
        value: 'с',
        class: 'passive',
      },
    ],
    fourthRow: [
      {
        value: 'м',
        class: 'passive',
      },
      {
        value: 'и',
        class: 'passive',
      },
      {
        value: 'т',
        class: 'passive',
      },
      {
        value: 'ь',
        class: 'passive',
      },
      {
        value: 'ъ',
        class: 'passive',
      },
      {
        value: 'б',
        class: 'passive',
      },
      {
        value: 'ю',
        class: 'passive',
      },
    ],
  };

  words = [];

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

  isHelpUsed = false;

  constructor(private router: Router) {}

  async ngOnInit() {
    this.fetchWords();
  }

  async ionViewWillEnter() {
    this.restoreDefaults();
    await this.generateWord();

    console.log(this.currentWord);
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

  endGame() {
    this.router.navigate(['home']);

    this.restoreDefaults();
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
    if (this.isHelpUsed) {
      this.toggleAlert(this.hintOnlyOnce.nativeElement);
      return;
    }

    if (this.currentGuessRow === 'rowSix') {
      this.toggleAlert(this.noHintForLastRow.nativeElement);
      return;
    }

    this.isHelpUsed = true;

    const hintWord = await this.getHintWord();

    if (hintWord) {
      for (const letter in hintWord) {
        if (hintWord.hasOwnProperty(letter)) {
          this.guesses[this.currentGuessRow][letter].value = hintWord[letter];
        }
      }
      await this.completeGuessRow(hintWord);
      this.currentGuessRow = this.getNextGuessRow();
    }
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
      hintWord.length !== this.currentWord.term.length
    ) {
      return this.getHintWord();
    }

    return hintWord;
  }

  private async restoreDefaults() {
    this.currentWordIndex = null;
    this.isHelpUsed = false;
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
        }
      }
    }
    this.closeGame.nativeElement.checked = false;
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
