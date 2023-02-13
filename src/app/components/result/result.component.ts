import { Component } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.sass']
})
export class ResultComponent {
  product: any
  model: any
  
  calculateWeight() {
    let totalWeight = 0;
    for (const field of this.product.fields) {
      if (field.type === 'radio' || field.type === 'select') {
        for (const option of field.templateOptions.options) {
          if (this.model[field.key] === option.value) {
            totalWeight += option.weight;
            break;
          }
        }
      } else if (field.type === 'multicheckbox') {
        for (const option of field.templateOptions.options) {
          if (this.model[field.key][option.value]) {
            totalWeight += option.weight;
          }
        }
      }
    }
    return totalWeight;
  }

  calculateMaxWeight() {
    let maxWeight = 0;
    for (const field of this.product.fields) {
      for (const option of field.templateOptions.options) {
        maxWeight += option.weight;
      }
    }
    return maxWeight;
  }


}
