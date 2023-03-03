import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private db!: IDBDatabase;

  constructor() {
    this.initDatabase().then(() => {
      console.log('IndexedDB initialized');
    });
  }

  private async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open('myDatabase', 1);

      openRequest.onerror = (event: any) => {
        console.error('IndexedDB error:', event.target.errorCode);
        reject(event.target.errorCode);
      };

      openRequest.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve();
      };

      openRequest.onupgradeneeded = (event: any) => {
        const db = event.target.result;

        db.createObjectStore('myObjectStore');
      };
    });
  }

  public async setItem(key: string, value: any): Promise<void> {
    await this.initDatabase();
    const transaction = this.db.transaction(['myObjectStore'], 'readwrite');
    const objectStore = transaction.objectStore('myObjectStore');

    const request = objectStore.put(value, key);

    request.onerror = (event: any) => {
      console.error('IndexedDB error:', event.target.errorCode);
    };
  }

  public async getItem(key: string): Promise<any> {
    await this.initDatabase();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['myObjectStore'], 'readonly');
      const objectStore = transaction.objectStore('myObjectStore');

      const request = objectStore.get(key);

      request.onerror = (event: any) => {
        console.error('IndexedDB error:', event.target.errorCode);
        reject(event.target.errorCode);
      };

      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
    });
  }

  public async removeItem(key: string): Promise<void> {
    await this.initDatabase();
    const transaction = this.db.transaction(['myObjectStore'], 'readwrite');
    const objectStore = transaction.objectStore('myObjectStore');

    const request = objectStore.delete(key);

    request.onerror = (event: any) => {
      console.error('IndexedDB error:', event.target.errorCode);
    };
  }

  public async clear(): Promise<void> {
    await this.initDatabase();
    const transaction = this.db.transaction(['myObjectStore'], 'readwrite');
    const objectStore = transaction.objectStore('myObjectStore');

    const request = objectStore.clear();

    request.onerror = (event: any) => {
      console.error('IndexedDB error:', event.target.errorCode);
    };
  }
}
