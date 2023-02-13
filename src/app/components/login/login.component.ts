import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-login',
  template: `
    <h2 class="text-center mb-4">Login</h2>
    <form (ngSubmit)="onSubmit()" class="form-group">
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" [(ngModel)]="password" name="password" class="form-control">
      </div>
      <button type="submit" class="btn btn-primary btn-block">Submit</button>
    </form>
  `,
})
export class LoginComponent {
  password = '';

  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit() {
    this.loginService.login(this.password)
      .subscribe(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        this.router.navigate(['/']);
      });
  }
}
