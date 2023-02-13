import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientDataService {
  clientData: { [key: string]: any } = {};

  constructor() {
    this.clientData = localStorage.getItem('clientData') ? JSON.parse(localStorage.getItem('clientData') || "") : {};
  }

  updateClientData(property: string, value: any) {
    this.clientData[property] = value;
    localStorage.setItem('clientData', JSON.stringify(this.clientData));
  }
  clearClientData() {
    this.clientData = {};
    localStorage.removeItem('clientData');
  }
}
