import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IndexedDBService } from 'src/app/indexed-db.service';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="https://g-i-p.be/wp-content/themes/gip/statics/images/gip-gestion-informatique-professionnelle.svg" alt="Logo" width="60" height="40" class="d-inline-block align-text-top">
        </a>
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <span class="nav-link" *ngIf="username">{{ username }}</span>
            </li>
          </ul>
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  username: string | null = null;

  constructor(private router: Router, private indexedDBService: IndexedDBService) {}

  ngOnInit(): void {
    this.router.events.subscribe(async event => {
      if (event instanceof NavigationEnd && event.url === '/') {
        this.username = await this.indexedDBService.getItem('username');
      }
    });
  }
}
