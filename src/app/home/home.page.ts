import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private storageService: StorageService
  ) {}

  ionViewWillEnter() {
    this.storageService.get('theme').then(theme => {
      if (theme) {
        this.selectTheme(theme);
      } else {
        this.selectTheme('coffe');
      }
    });
  }

  selectTheme(theme: string) {
    this.renderer.setAttribute(this.document.body, 'data-theme', theme);
    this.storageService.set('theme', theme);
  }
}
