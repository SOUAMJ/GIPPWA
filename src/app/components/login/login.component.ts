import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { IndexedDBService } from 'src/app/indexed-db.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
})
export class LoginComponent {
  password = '';

  constructor(private loginService: LoginService, private indexedDBService: IndexedDBService, private router: Router) {}

  onSubmit() {
    this.loginService.login(this.password)
      .subscribe((response: any) => {
        this.indexedDBService.setItem('token', response.token);
        this.indexedDBService.setItem('user', response.username);
        this.router.navigate(['/']);
      });
  }
}