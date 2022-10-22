import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { StorageService } from '../services/storage.service';
import { environment } from 'src/environments/environment';
import { LogService } from '../services/log.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('logModal') logModal: ElementRef;

  version: string = environment.version;
  logs: string[] = [];
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private storageService: StorageService,
    private logService: LogService
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

  selectTheme($e: any) {
    const theme = $e.target ? $e.target.value : $e;
    this.renderer.setAttribute(this.document.body, 'data-theme', theme);
    this.storageService.set('theme', theme);
  }

  displayLog() {
    this.logs = this.logService.getOutput();
    this.logModal.nativeElement.checked = true;
  }
}
