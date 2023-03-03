import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndexedDBService } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly baseUrl = 'http://localhost:4000';

  constructor(private http: HttpClient, private indexedDBService: IndexedDBService) {}

  login(password: string): Observable<{ token: string, username: string }> {
    return this.http.post<any>(`${this.baseUrl}/login`, { password }).pipe(
      map(response => {
        this.indexedDBService.setItem('token', response.token);
        this.indexedDBService.setItem('username', response.username);
        return response;
      })
    );
  }

  logout(): void {
    this.indexedDBService.clear();
  }

  getToken(): Promise<string> {
    return this.indexedDBService.getItem('token');
  }

  getUsername(): Promise<string> {
    return this.indexedDBService.getItem('username');
  }
}
