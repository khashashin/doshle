import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  output: string[] = [];

  constructor() {}

  log(message: any) {
    if (typeof message === 'object') {
      this.output.push(JSON.stringify(message));
    }
    if (typeof message === 'string') {
      this.output.push(message);
    }
  }

  clear() {
    this.output = [];
  }

  getOutput() {
    return this.output;
  }
}
