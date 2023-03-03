import { Injectable } from '@angular/core';
import { IndexedDBService } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class ClientDataService {
  clientData: { [key: string]: any } = {};

  constructor(private indexedDBService: IndexedDBService) {
    this.indexedDBService.getItem('clientData').then((data) => {
      if (data) {
        this.clientData = data;
      }
    });
  }

  updateClientData(property: string, value: any) {
    this.clientData[property] = value;
    this.indexedDBService.setItem('clientData', this.clientData);
  }

  clearClientData() {
    this.clientData = {};
    this.indexedDBService.removeItem('clientData');
  }
}
