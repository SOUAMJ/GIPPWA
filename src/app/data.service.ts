import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from './shareddata.service';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  readonly baseUrl;

  constructor(private http: HttpClient,private sharedDataService: SharedDataService) {
    this.baseUrl='http://localhost:4000'
   }


  getData(url: string) {
    return this.http.get(`${this.baseUrl}/${url}`).subscribe(data => {
      this.sharedDataService.setData(data);
    });;
  }

  postData(url: string, payload: Object){
    return this.http.post(`${this.baseUrl}/${url}`, payload).subscribe(data => {
      this.sharedDataService.setData(data);
    });
  }
}
