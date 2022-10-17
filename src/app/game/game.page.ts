import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
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

  wrongLetter = 'btn-active btn-ghost';
  wrongPosition = 'btn-active btn-primary';
  correctLetter = 'btn-success';

  constructor(private router: Router) {}

  ngOnInit() {}

  endGame() {
    this.router.navigate(['home']);
  }
}
