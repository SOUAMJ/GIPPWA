import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shareddata.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit{
  data: any
  constructor(private sharedDataService: SharedDataService,
              private router: Router){}
  

  ngOnInit(){
    this.sharedDataService.data$.subscribe(data => { //get latest data from the shared service (in this case questions json from API)
      this.data = data;
    })
  }
}
