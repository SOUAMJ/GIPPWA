import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos: string = `latitude: ${position.coords.latitude}, longitude: ${position.coords.longitude}`;
          resolve(pos);
        },
        (error) => {
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get user location timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred.";
              break;
          }
          reject(errorMessage);
        }
      );
    });
  }
}
