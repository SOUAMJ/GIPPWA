import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { DataService } from './data.service';
import { SharedDataService } from './shareddata.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{

  data:any
  constructor(private dataService: DataService,private sharedDataService: SharedDataService){}
  ngOnInit(): void {
      this.dataService.getData('questions')
      this.sharedDataService.data$.subscribe(data=>{
        this.data=data
      })
  }
  isConnected(){
    if(!localStorage.getItem('token') == null){
      return true
    }else{
      return false
    }
  }
  
}
