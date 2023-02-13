import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private serverUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  login(password: string): Observable<{ token: string, username: string }> {
    return from(this.http.post<{ token: string, username: string }>(`${this.serverUrl}/login`, { password }))
      .pipe(map(response => {
        localStorage.setItem('token', response.token);
        return response;
      }));
  }
}
