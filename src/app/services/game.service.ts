import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  shareImageProps: any = {
    cellWidth: 40,
    correctCellColor: '#166534',
    incorrectCellColor: '#f97316',
    wrongCellColor: '#6b7280',
  };

  constructor() {}

  async getShareImageFromResult(canvas: HTMLCanvasElement, guesses: any) {
    const matrix = await this.generateMatrix(guesses);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 440, 440);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Результат игры', 440 / 2, 50);

    for (const row in matrix) {
      if (matrix.hasOwnProperty(row)) {
        for (const col in matrix[row]) {
          if (matrix[row].hasOwnProperty(col)) {
            const cell = matrix[row][col];
            if (cell.value) {
              ctx.fillStyle = cell.backgroundColor;
              ctx.fillRect(
                cell.x,
                cell.y,
                this.shareImageProps.cellWidth,
                this.shareImageProps.cellWidth
              );

              ctx.font = '20px Arial';
              ctx.fillStyle = '#000000';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(
                cell.value,
                cell.x + this.shareImageProps.cellWidth / 2,
                cell.y + this.shareImageProps.cellWidth / 2
              );
            } else {
              const borderWidth = 2;
              ctx.fillStyle = '#000000';
              ctx.fillRect(
                cell.x,
                cell.y,
                this.shareImageProps.cellWidth,
                this.shareImageProps.cellWidth
              );
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(
                cell.x + borderWidth,
                cell.y + borderWidth,
                this.shareImageProps.cellWidth - borderWidth * 2,
                this.shareImageProps.cellWidth - borderWidth * 2
              );
            }
          }
        }

        if (row !== '0') {
          ctx.fillStyle = '#000000';
          ctx.fillRect(10, 77 + 45 * parseInt(row, 10), 420, 1);
        }
      }
    }

    return canvas.toDataURL();
  }

  async generateMatrix(guesses: any) {
    const rows = [
      'rowOne',
      'rowTwo',
      'rowThree',
      'rowFour',
      'rowFive',
      'rowSix',
    ];

    const matrix = [];

    const xStart = 440 / 2 - (guesses.rowOne.length * 45) / 2;

    for (const row in rows) {
      if (rows.hasOwnProperty(row)) {
        matrix.push([]);
        for (const cell in guesses[rows[row]]) {
          if (guesses[rows[row]].hasOwnProperty(cell)) {
            matrix[row].push({
              x: xStart + 45 * parseInt(cell, 10),
              y: 80 + 45 * parseInt(row, 10),
              value: guesses[rows[row]][cell].value,
              backgroundColor: await this.getBackgroundColor(
                guesses[rows[row]][cell].className
              ),
            });
          }
        }
      }
    }

    return matrix;
  }

  async getBackgroundColor(className) {
    switch (className) {
      case 'bg-green-800 border-green-800':
        return this.shareImageProps.correctCellColor;
      case 'bg-orange-500 border-orange-500':
        return this.shareImageProps.incorrectCellColor;
      case 'bg-gray-500 border-gray-500':
        return this.shareImageProps.wrongCellColor;
    }
  }
}
