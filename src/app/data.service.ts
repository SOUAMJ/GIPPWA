import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get(`${this.baseUrl}/${url}`,{headers}).subscribe(data => {
      this.sharedDataService.setData(data);
    });;
  }

  postData(url: string, payload: Object){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.baseUrl}/${url}`, payload,{headers}).subscribe(data => {
      this.sharedDataService.setData(data);
    });
  }
}
