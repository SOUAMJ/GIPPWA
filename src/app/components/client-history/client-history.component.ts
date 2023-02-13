import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ClientFormService } from 'src/app/client-form.service';

@Component({
  selector: 'app-client-history',
  template: `
    <table class="table">
  <thead>
    <tr>
      <th scope="col">First Name</th>
      <th scope="col">Last Name</th>
      <th scope="col">Phone Number</th>
      <th class='d-none' scope="col">VAT Number</th>
    </tr>
  </thead>
  <tbody>
    <tr scope="row" *ngFor="let form of forms" (click)="onFormClick(form)">
        <td>{{ form.firstName }}</td>
        <td>{{ form.lastName }}</td>
        <td>{{ form.phoneNumber }}</td>
        <td class='d-none'>{{ form.vatNumber }}</td>
    </tr>
  </tbody>
</table>
  `,
  styleUrls: ['./client-history.component.sass']
})
export class ClientHistoryComponent implements OnInit {
  forms: any[] = [];
  @Output() formSelected = new EventEmitter<FormData>();

  constructor(private clientFormService: ClientFormService) { }

  ngOnInit() {
    this.forms = this.clientFormService.getLastThreeForms();
  }

  onFormClick(form: FormData) {
    this.formSelected.emit(form);
  }
}
