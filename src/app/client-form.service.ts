import { Injectable } from '@angular/core';
import { IndexedDBService } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class ClientFormService {
  private readonly OBJECT_STORE_NAME = 'client_forms';

  constructor(private indexedDBService: IndexedDBService) { }

  async getForms(): Promise<any[]> {
    const forms = await this.indexedDBService.getItem(this.OBJECT_STORE_NAME);
    return forms ? forms : [];
  }

  getLastThreeForms(): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const forms = await this.getForms();
      resolve(forms.slice(-3));
    });
  }
  async addForm(form: any): Promise<void> {
    const forms = await this.getForms();
    const existingFormIndex = forms.findIndex(f => f.firstName === form.firstName && f.lastName === form.lastName); // Check if form with the same firstName and lastName already exists
    if (existingFormIndex > -1) { // If exists
      const existingForm = forms[existingFormIndex];
      if (JSON.stringify(existingForm) !== JSON.stringify(form)) { // If form data has changed
        forms[existingFormIndex] = form; // Update form data
        await this.indexedDBService.setItem(this.OBJECT_STORE_NAME, forms); // Save updated forms to indexedDB
      }
    } else { // If doesn't exist
      forms.unshift(form); // Add new form to the beginning of the array
      if (forms.length > 3) { // If more than 3 forms, remove the last one
        forms.pop();
      }
      await this.indexedDBService.setItem(this.OBJECT_STORE_NAME, forms); // Save updated forms to indexedDB
    }
  }
}
