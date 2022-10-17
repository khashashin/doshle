import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isModalOpen = false;

  constructor() {}

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
