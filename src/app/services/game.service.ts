import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

interface IGameState {
  isStarted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private gameState: BehaviorSubject<IGameState> = new BehaviorSubject(null);

  constructor(private storageService: StorageService) {}

  startGame() {
    this.gameState.next({
      isStarted: true,
    });
  }

  stopGame() {
    this.gameState.next({
      isStarted: false,
    });
  }
}
