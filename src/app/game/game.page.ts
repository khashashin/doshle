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
  @ViewChild('congratulations') congratulations: ElementRef;

  keyboard = {
    firstRow: [
      {
        value: 'й',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'ц',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'у',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'к',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'е',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'н',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'г',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'ш',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'щ',
        class: 'passive',
        disabled: false,
      },
    ],
    secondRow: [
      {
        value: 'з',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'х',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'Ӏ',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'ф',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'ы',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'в',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'а',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'п',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'р',
        class: 'passive',
        disabled: false,
      },
    ],
    thirdRow: [
      {
        value: 'о',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'л',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'д',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'ж',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'э',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'ё',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'я',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'ч',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'с',
        class: 'passive',

        disabled: false,
      },
    ],
    fourthRow: [
      {
        value: 'м',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'и',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'т',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'ь',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'ъ',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'б',
        class: 'passive',
        disabled: false,
      },
      {
        value: 'ю',
        class: 'passive',
        disabled: false,
      },
    ],
  };

  words = [];

  wrongLetterClass = 'btn-active btn-ghost';
  wrongPositionClass = 'btn-active btn-primary';
  correctLetterClass = 'btn-success';

  correctCellClass = 'correct';
  incorrectCellClass = 'incorrect';
  wrongCellClass = 'wrong';

  guesses = {
    rowOne: [],
    rowTwo: [],
    rowThree: [],
    rowFour: [],
    rowFive: [],
    rowSix: [],
  };

  currentWord: any;
  currentGuessRow = 'rowOne';
  currentColumn = 0;

  constructor(private router: Router) {}

  async ngOnInit() {
    await this.generateWord();

    console.log(this.currentWord);

    this.fetchWords();
  }

  async keyClicked(row, index) {
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
    if (guess === this.currentWord.term) {
      await this.completeGuessRow(guess);
      this.congratulations.nativeElement.checked = true;
    } else {
      await this.completeGuessRow(guess);
    }

    this.currentGuessRow = this.getNextGuessRow();
    this.currentColumn = 0;
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

  private async changeCellStyle(row, col, className) {
    this.guesses[row][col].class = className;
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
    const key = this.generateRandomNumber();
    await fetch('assets/data_transl.json').then(async response => {
      await response.json().then(data => {
        this.currentWord = data[key];
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
