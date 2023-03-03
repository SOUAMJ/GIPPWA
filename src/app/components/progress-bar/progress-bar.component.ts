import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  template: `
  <div class="col-12 mb-3">
    <svg viewBox="0 0 100 12" style="border: 0.5px solid black;">
      <rect width="100%" height="100%" fill="none" stroke="#333" stroke-width="0.1"></rect>
      <rect [attr.width]="progress" height="100%" [attr.fill]="color"></rect>
      <text x="50" y="8" text-anchor="middle" fill="#333" [style.font-size.px]="fontSize">{{ progress }}%</text>
    </svg>
  </div>
  `
})
export class ProgressBarComponent {
  @Input() progress!: number;

  get color() {
    let red, green;
    if (this.progress < 50) {
      red = 255;
      green = Math.floor(255 * (2 * (this.progress / 100)));
    } else {
      red = Math.floor(255 * (2 * (1 - this.progress / 100)));
      green = 255;
    }
    return `rgb(${red}, ${green}, 0)`;
  }

  get fontSize() {
    const maxFontSize = 10;
    const minFontSize = 6;
    const maxWidth = 70;
    const minWidth = 20;
    const width = (this.progress / 100) * (maxWidth - minWidth) + minWidth;
    const fontSize = (this.progress / 100) * (maxFontSize - minFontSize) + minFontSize;
    return fontSize < width ? fontSize : width;
  }
}