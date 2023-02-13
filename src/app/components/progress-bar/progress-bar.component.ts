import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  template: `
    <svg viewBox="0 0 100 20">
      <rect [attr.width]="progress" height="100%" [attr.fill]="color"></rect>
    </svg>
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
}