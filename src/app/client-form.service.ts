import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientFormService {
  private readonly LOCAL_STORAGE_KEY = 'client_forms';

  constructor() { }

  getForms(): any[] {
    const forms = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return forms ? JSON.parse(forms) : [];
  }

  getLastThreeForms(): any[] {
    const forms = this.getForms();
    return forms.slice(-3);
  }

  addForm(form: any): void {
    const forms = this.getForms();
    forms.push(form);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(forms));
  }
}
